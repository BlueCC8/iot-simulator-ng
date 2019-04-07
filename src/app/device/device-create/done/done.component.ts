import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormService } from '../form.service';
import { DevicesService } from '../../device.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/navigation/header/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../device.integrated-model';
import { NetLayersService } from 'src/app/networkLayer/networkLayer.service';
import { AppLayersService } from 'src/app/applicationLayer/applicationLayer.service';
import { LinkLayersService } from 'src/app/linkLayer/linkLayer.service';
import { WifisService } from 'src/app/wifi/wifi.service';
import { EthernetsService } from 'src/app/ethernet/ethernet.service';
import { Device } from '../../device.model';
import { LinkLayerModel } from 'src/app/linkLayer/linkLayer.model';

@Component({
  selector: 'app-done',
  templateUrl: 'done.component.html',
  styleUrls: ['done.component.css'],
  providers: [FormService]
})
export class DoneComponent implements OnInit, OnDestroy {
  // stepOne;
  // stepTwo;
  // stepThree;
  // stepFour;
  // stepFive;
  // stepSix;
  isLoading = false;
  isLinear = false;
  diagnostics = true;

  form: FormGroup;
  private mode = 'create';
  private deviceId: string;
  private linLayerId: string;
  private etherId: string;
  private wifiId: string;
  private netLayerId: string;
  private appLayerId: string;
  private authListenerSubs = new Subscription();

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private netLayerService: NetLayersService,
    private appLayerService: AppLayersService,
    private linLayerService: LinkLayersService,
    private wifiService: WifisService,
    private etherService: EthernetsService,
    private devicesService: DevicesService,
    public formService: FormService
  ) {
    this.form = this.formService.initDevice;
  }
  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('deviceId')) {
        this.mode = 'edit';
        this.deviceId = paramMap.get('deviceId');
        this.isLoading = false;
        // * Get instance

        // this.ethernetsService.getEthernet(this.etherId).subscribe(etherData => {
        //   this.isLoading = false;
        //   this.ether = {
        //     id: etherData._id,
        //     etherName: etherData.etherName,
        //     etherStandard: etherData.etherStandard,
        //     etherDataRate: etherData.etherDataRate,
        //     imagePath: etherData.imagePath,
        //     username: etherData.username
        //   };

        //   this.form.setValue({
        //     title: this.ether.etherName,
        //     standard: this.ether.etherStandard,
        //     throughput: this.ether.etherDataRate,
        //     image: this.ether.imagePath
        //   });
        // });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
  }

  keys(): Array<string> {
    return Object.keys(this.form);
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    console.log(this.formService.initDevice.value);
    const device: DeviceIntegratedModel = this.formService.initDevice.value;
    this.isLoading = true;

    const newDevice: Device = {
      id: this.deviceId,
      devName: device.devName,
      appLayerID: '',
      tranLayer: device.tranLayer,
      netLayerID: '',
      linLayerID: '',
      devProducer: device.devProducer,
      devPrice: device.devPrice,
      devImgUrl: device.devImgUrl,
      username: device.username
    };
    const newLinLayer: LinkLayerModel = {
      id: device.linLayerID.id,
      llName: device.linLayerID.llName,
      llPriorityType: device.linLayerID.llPriorityType,
      llRole: device.linLayerID.llRole,
      llBluetooth: device.linLayerID.llBluetooth,
      llLrWpan: device.linLayerID.llLrWpan,
      llLrWpanType: device.linLayerID.llLrWpanType,
      llCelullar: device.linLayerID.llCelullar,
      llNFC: device.linLayerID.llNFC,
      llProducer: device.linLayerID.llProducer,
      llWifiID: '',
      llEthernetID: ''
    };
    if (this.mode === 'create') {
      const netLayer = device.netLayerID;
      this.netLayerService.addNetLayer(netLayer).subscribe(netLayerId => {
        this.netLayerId = netLayerId;
      });

      const appLayer = device.appLayerID;
      this.appLayerService.addAppLayer(appLayer).subscribe(appLayerId => {
        this.appLayerId = appLayerId;
      });

      const wifi = device.linLayerID.llWifiID;
      this.wifiService.addWifi(wifi).subscribe(wifiId => {
        this.wifiId = wifiId;
      });

      const ether = device.linLayerID.llEthernetID;
      this.etherService.addEthernet(ether).subscribe(etherId => {
        this.etherId = etherId;
      });

      newLinLayer.llEthernetID = this.etherId;
      newLinLayer.llWifiID = this.wifiId;

      this.linLayerService.addLinLayer(newLinLayer).subscribe(linLayerId => {
        this.linLayerId = linLayerId;
      });
      newDevice.linLayerID = this.linLayerId;
      newDevice.appLayerID = this.appLayerId;
      newDevice.netLayerID = this.netLayerId;

      this.devicesService.addDevice(newDevice);
    } else {
      const netLayer = device.netLayerID;
      this.netLayerService.updateNetLayer(netLayer);

      const appLayer = device.appLayerID;
      this.appLayerService.updateAppLayer(appLayer);

      const wifi = device.linLayerID.llWifiID;
      this.wifiService.updateWifi(wifi);

      const ether = device.linLayerID.llEthernetID;
      this.etherService.updateEthernet(ether);

      newLinLayer.llEthernetID = ether.id;
      newLinLayer.llWifiID = wifi.id;

      this.linLayerService.updateLinLayer(newLinLayer);

      newDevice.linLayerID = newLinLayer.id;
      newDevice.appLayerID = appLayer.id;
      newDevice.netLayerID = netLayer.id;
      this.devicesService.updateDevice(newDevice);
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
