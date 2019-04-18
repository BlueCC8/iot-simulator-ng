import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { NGXLogger } from 'ngx-logger';
import { AppLayerModel } from 'src/app/core/applicationLayer/applicationLayer.model';
import { AppLayersService } from 'src/app/core/applicationLayer/applicationLayer.service';

@Component({
  selector: 'app-application-layer-step-two',
  templateUrl: './application-layer-step-two.component.html',
  styleUrls: ['./application-layer-step-two.component.css']
})
export class ApplicationLayerStepTwoComponent implements OnInit, OnDestroy {
  private componentName = ApplicationLayerStepTwoComponent.name + ' ';
  frmStepTwo: FormGroup;
  imagePreview: string;
  isLoading = false;
  device: DeviceIntegratedModel;
  mode: string;
  deviceId: string;
  isPopulated = true;
  totalAppLayers = 0;
  appLayers: AppLayerModel[];

  private pageSize = null;
  private page = null;
  private appLayersSubs = new Subscription();
  @Output() saveStepTwoForm = new EventEmitter<FormGroup>();

  ngOnInit() {}

  constructor(
    public devicesService: DevicesService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: DeviceCreateSteptsFormService,
    private appLayersService: AppLayersService,
    private logger: NGXLogger
  ) {
    // this.step = this.formBuilder.group({
    //   id: new FormControl(null, {}),
    //   alName: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   alHTTP: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   alCoAp: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   alWebSocket: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   alMQTTE: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   alDDS: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   alAMQP: new FormControl(null, {
    //     validators: [Validators.required]
    //   })
    // });
    this.frmStepTwo = this.formBuilder.group({
      appLayer: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = true;
    this.appLayersService.getAppLayers(this.pageSize, this.page);
    this.appLayersSubs = this.appLayersService
      .getAppLayersUpdateListener()
      .subscribe((appLayersData: { appLayers: AppLayerModel[]; maxAppLayers: number }) => {
        this.isLoading = false;
        this.logger.log(this.componentName + 'not loading');
        this.logger.log(this.componentName + 'AppLayers', appLayersData.appLayers);
        this.appLayers = appLayersData.appLayers;
        this.totalAppLayers = appLayersData.maxAppLayers;
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
    //       if (this.device.appLayerID) {
    //         // * Set values
    //         this.step.setValue({
    //           id: this.device.appLayerID.id,
    //           alName: this.device.appLayerID.alName,
    //           alHTTP: this.device.appLayerID.alHTTP,
    //           alCoAp: this.device.appLayerID.alCoAp,
    //           alWebSocket: this.device.appLayerID.alWebSocket,
    //           alMQTTE: this.device.appLayerID.alMQTTE,
    //           alDDS: this.device.appLayerID.alDDS,
    //           alAMQP: this.device.appLayerID.alAMQP
    //         });
    //       }
    //     });
    //   } else {
    //     this.mode = 'create';
    //     this.deviceId = null;
    //   }
    // });
    // this.formService.stepReady(this.frmStepTwo, 'two');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }
  onSave() {
    this.saveStepTwoForm.emit(this.frmStepTwo);
    this.logger.log(this.componentName, this.frmStepTwo);
  }
  ngOnDestroy() {
    this.appLayersSubs.unsubscribe();
  }
}
