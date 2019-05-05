import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { NGXLogger } from 'ngx-logger';
import { NetLayersService } from 'src/app/core/networkLayer/networkLayer.service';
import { NetLayerModel } from 'src/app/core/networkLayer/networkLayer.model';
@Component({
  selector: 'app-network-step-three',
  templateUrl: './network-step-three.component.html',
  styleUrls: ['./network-step-three.component.css']
})
export class NetworkStepThreeComponent implements OnInit, OnDestroy {
  private componentName = NetworkStepThreeComponent.name + ' ';
  frmStepThree: FormGroup;
  imagePreview: string;
  isLoading = false;
  netLayers: NetLayerModel[];
  totalNetLayers: number;
  mode: string;
  deviceId: string;
  isPopulated = true;
  pageSize = null;
  page = null;
  private netLayersSubs$ = new Subscription();
  @Output() saveStepThreeForm = new EventEmitter<FormGroup>();
  ngOnInit() {}

  constructor(
    public netLayersService: NetLayersService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: DeviceCreateSteptsFormService,
    private logger: NGXLogger
  ) {
    // this.step = this.formBuilder.group({
    //   id: new FormControl(null, {}),
    //   nlName: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   nlIPv4: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   nlIPv6: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   nlZig_LoWpan: new FormControl(null, {
    //     validators: [Validators.required]
    //   })
    // });
    this.frmStepThree = this.formBuilder.group({
      netLayer: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = true;
    this.netLayersService.getNetLayers(this.pageSize, this.page);
    this.netLayersSubs$ = this.netLayersService
      .getNetLayersUpdateListener()
      .subscribe((netLayersData: { netLayers: NetLayerModel[]; maxNetLayers: number }) => {
        this.isLoading = false;
        this.logger.log(this.componentName + 'not loading');
        this.logger.log(this.componentName + 'NetLayers', netLayersData.netLayers);
        this.netLayers = netLayersData.netLayers;
        this.totalNetLayers = netLayersData.maxNetLayers;
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
    //       if (this.device.netLayerID) {
    //         this.step.setValue({
    //           id: this.device.netLayerID.id,
    //           nlName: this.device.netLayerID.nlName,
    //           nlIPv4: this.device.netLayerID.nlIPv4,
    //           nlIPv6: this.device.netLayerID.nlIPv6,
    //           nlZig_LoWpan: this.device.netLayerID.nlZig_LoWpan
    //         });
    //       }
    //     });
    //   } else {
    //     this.mode = 'create';
    //     this.deviceId = null;
    //   }
    // });
    // this.formService.stepReady(this.frmStepThree, 'three');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }
  onSave() {
    // this.saveStepThreeForm.emit(this.frmStepThree);
    this.logger.log(this.componentName, this.frmStepThree);
  }
  ngOnDestroy() {
    this.netLayersSubs$.unsubscribe();
  }
}
