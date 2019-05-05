import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { NGXLogger } from 'ngx-logger';
import { WifisService } from 'src/app/core/wifi/wifi.service';
import { WifiModel } from 'src/app/core/wifi/wifi.model';
@Component({
  selector: 'app-wifi-step-five',
  templateUrl: './wifi-step-five.component.html',
  styleUrls: ['./wifi-step-five.component.css']
})
export class WifiStepFiveComponent implements OnInit, OnDestroy {
  private componentName = WifiStepFiveComponent.name + ' ';
  frmStepFive: FormGroup;
  imagePreview: string;
  isLoading = false;
  wifis: WifiModel[];
  mode: string;
  deviceId: string;
  isPopulated = true;
  pageSize = null;
  page = null;
  totalWifis = 0;
  private wifisSubs$ = new Subscription();
  @Output() saveStepFiveForm = new EventEmitter<FormGroup>();
  ngOnInit() {}

  constructor(
    public wifisService: WifisService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: DeviceCreateSteptsFormService,
    private logger: NGXLogger
  ) {
    // this.step = this.formBuilder.group({
    //   id: new FormControl(null, {}),
    //   wifiName: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   wifiFrequancy: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   wifiRange: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   wifiDataRate: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   })
    // });
    this.frmStepFive = this.formBuilder.group({
      wifi: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = true;
    this.wifisService.getWifis(this.pageSize, this.page);
    this.wifisSubs$ = this.wifisService
      .getWifisUpdateListener()
      .subscribe((wifisData: { wifis: WifiModel[]; maxWifis: number }) => {
        this.isLoading = false;
        this.logger.log(this.componentName + 'not loading');
        this.logger.log(this.componentName + 'Wifis', wifisData.wifis);
        this.wifis = wifisData.wifis;
        this.totalWifis = wifisData.maxWifis;
      });
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has('deviceId')) {
    //     this.mode = 'edit';
    //     this.deviceId = paramMap.get('deviceId');
    //     this.isLoading = true;
    //     // * Get instance
    //     this.devicesService.getDevice(this.deviceId, this.isPopulated).subscribe(deviceData => {
    //       this.isLoading = false;
    //       this.device = deviceData;
    //       this.device = this.devicesService.removeUndefProp(this.device);
    //       this.logger.log(this.componentName, this.device);
    //       // * Set values
    //       if (this.device.linLayerID.llWifiID) {
    //         this.step.setValue({
    //           id: this.device.linLayerID.llWifiID.id,
    //           wifiName: this.device.linLayerID.llWifiID.wifiName,
    //           wifiFrequancy: this.device.linLayerID.llWifiID.wifiFrequancy,
    //           wifiRange: this.device.linLayerID.llWifiID.wifiRange,
    //           wifiDataRate: this.device.linLayerID.llWifiID.wifiDataRate
    //         });
    //       }
    //     });
    //   } else {
    //     this.mode = 'create';
    //     this.deviceId = null;
    //   }
    // });
    // this.formService.stepReady(this.frmStepFive, 'five');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }
  onSave() {
    // this.saveStepFiveForm.emit(this.frmStepFive);
    this.logger.log(this.componentName, this.frmStepFive);
  }
  ngOnDestroy() {
    this.wifisSubs$.unsubscribe();
  }
}
