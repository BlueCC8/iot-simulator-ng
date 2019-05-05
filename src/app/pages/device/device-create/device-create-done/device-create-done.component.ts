import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../device-create-steps-form.service';
import { DevicesService } from '../../device.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LinkLayersService } from 'src/app/core/linkLayer/linkLayer.service';
import { Device } from '../../device.model';
import { LinkLayerModel } from 'src/app/core/linkLayer/linkLayer.model';
import { NGXLogger } from 'ngx-logger';
import { MatVerticalStepper } from '@angular/material';
import { AppLayerModel } from 'src/app/core/applicationLayer/applicationLayer.model';
import { NetLayerModel } from 'src/app/core/networkLayer/networkLayer.model';
import { WifiModel } from 'src/app/core/wifi/wifi.model';
import { EthernetModel } from 'src/app/core/ethernet/ethernet.model';
import { ApplicationLayerStepTwoComponent } from '../device-create-steps/application-layer-step-two/application-layer-step-two.component';
import { BasicDetailsStepOneComponent } from '../device-create-steps/basic-details-step-one/basic-details-step-one.component';
import { NetworkStepThreeComponent } from '../device-create-steps/network-step-three/network-step-three.component';
import { LinkLayerStepFourComponent } from '../device-create-steps/link-layer-step-four/link-layer-step-four.component';
import { WifiStepFiveComponent } from '../device-create-steps/wifi-step-five/wifi-step-five.component';
import { EthernetStepSixComponent } from '../device-create-steps/ethernet-step-six/ethernet-step-six.component';

@Component({
  selector: 'app-device-create-done',
  templateUrl: 'device-create-done.component.html',
  styleUrls: ['device-create-done.component.css'],
  providers: [DeviceCreateSteptsFormService]
})
export class DeviceCreateDoneComponent implements OnInit, OnDestroy {
  isLoading = false;
  diagnostics = false;

  form: FormGroup;
  validCreateForm = false;
  device: Device;
  appLayer: AppLayerModel;
  netLayer: NetLayerModel;
  linkLayer: LinkLayerModel;
  ethernet: EthernetModel;
  wifi: WifiModel;

  private mode = 'create';
  private deviceId: string;
  private componentName = DeviceCreateDoneComponent.name + ' ';
  private authListenerSubs$ = new Subscription();

  @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;
  @ViewChild(BasicDetailsStepOneComponent) firstFormGroup: BasicDetailsStepOneComponent;
  @ViewChild(ApplicationLayerStepTwoComponent) secondFormGroup: ApplicationLayerStepTwoComponent;
  @ViewChild(NetworkStepThreeComponent) thirdFormGroup: NetworkStepThreeComponent;
  @ViewChild(LinkLayerStepFourComponent) fourthFormGroup: LinkLayerStepFourComponent;
  @ViewChild(WifiStepFiveComponent) fivethFormGroup: WifiStepFiveComponent;
  @ViewChild(EthernetStepSixComponent) sixthFormGroup: EthernetStepSixComponent;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private linLayerService: LinkLayersService,
    private devicesService: DevicesService,
    private logger: NGXLogger,
    public formService: DeviceCreateSteptsFormService
  ) {
    // this.form = this.formService.initDevice;
  }
  get frmStepOne(): FormGroup {
    return this.firstFormGroup ? this.firstFormGroup.frmStepOne : null;
  }
  get frmStepTwo(): FormGroup {
    return this.secondFormGroup ? this.secondFormGroup.frmStepTwo : null;
  }
  get frmStepThree(): FormGroup {
    return this.thirdFormGroup ? this.thirdFormGroup.frmStepThree : null;
  }
  get frmStepFour(): FormGroup {
    return this.fourthFormGroup ? this.fourthFormGroup.frmStepFour : null;
  }
  get frmStepFive(): FormGroup {
    return this.fivethFormGroup ? this.fivethFormGroup.frmStepFive : null;
  }
  get frmStepSix(): FormGroup {
    return this.sixthFormGroup ? this.sixthFormGroup.frmStepSix : null;
  }
  ngOnInit() {
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('deviceId')) {
        this.mode = 'edit';
        this.deviceId = paramMap.get('deviceId');
        this.isLoading = false;
        // * Get instance
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
  }

  onSubmit() {
    // Collect the data from formGroups

    this.device = this.collectDevice();
    this.appLayer = this.frmStepTwo.get('appLayer').value;
    this.netLayer = this.frmStepThree.get('netLayer').value;
    this.linkLayer = this.frmStepFour.get('linkLayer').value;
    this.wifi = this.frmStepFive.get('wifi').value;
    this.ethernet = this.frmStepSix.get('ether').value;
    this.linkLayer.llWifiID = this.wifi.id;
    this.linkLayer.llEthernetID = this.ethernet.id;

    this.isLoading = true;

    if (this.mode === 'create') {
      this.linkLayer.id = '';
      // * Add new because it's a new configuration
      this.linLayerService.addLinLayer(this.linkLayer).subscribe(linkLayerId => {
        this.device.linLayerID = linkLayerId;
        this.device.appLayerID = this.appLayer.id;
        this.device.netLayerID = this.netLayer.id;

        this.devicesService.addDevice(this.device);
        this.isLoading = false;
      });
    } else {
      // this.logger.log(this.componentName, this.linkLayer);
      // * History updated feature
      this.linkLayer.id = '';
      this.linLayerService.addLinLayer(this.linkLayer).subscribe(linkLayerId => {
        this.device.linLayerID = linkLayerId;
        this.device.appLayerID = this.appLayer.id;
        this.device.netLayerID = this.netLayer.id;

        this.devicesService.updateDevice(this.device);
        this.isLoading = false;
      });
    }
  }
  private collectDevice(): Device {
    return {
      id: this.deviceId,
      devName: this.frmStepOne.get('devName').value,
      appLayerID: '',
      tranLayer: this.frmStepOne.get('tranLayer').value,
      netLayerID: '',
      linLayerID: '',
      devProducer: this.frmStepOne.get('devProducer').value,
      devPrice: this.frmStepOne.get('devPrice').value,
      devImgUrl: this.frmStepOne.get('devImgUrl').value,
      username: this.frmStepOne.get('username').value
        ? this.frmStepOne.get('username').value
        : this.authService.getUsername()
    };
  }

  ngOnDestroy() {
    this.authListenerSubs$.unsubscribe();
  }
}
