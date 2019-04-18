import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { NGXLogger } from 'ngx-logger';
import { LinkLayersService } from 'src/app/core/linkLayer/linkLayer.service';
import { LinkLayerModel } from 'src/app/core/linkLayer/linkLayer.model';
@Component({
  selector: 'app-link-layer-step-four',
  templateUrl: './link-layer-step-four.component.html',
  styleUrls: ['./link-layer-step-four.component.css']
})
export class LinkLayerStepFourComponent implements OnInit, OnDestroy {
  private componentName = LinkLayerStepFourComponent.name + ' ';
  frmStepFour: FormGroup;
  imagePreview: string;
  isLoading = false;
  linkLayers: LinkLayerModel[];
  mode: string;
  deviceId: string;
  netLayerGroup: FormGroup;
  isPopulated = true;
  pageSize = null;
  page = null;
  totalLinkLayers = 0;

  private linkLayersSubs = new Subscription();
  @Output() saveStepFourForm = new EventEmitter<FormGroup>();

  ngOnInit() {}

  constructor(
    public linkLayersService: LinkLayersService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: DeviceCreateSteptsFormService,
    private logger: NGXLogger
  ) {
    // this.step = this.formBuilder.group({
    //   id: new FormControl(null, {}),
    //   llName: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   llPriorityType: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(1)]
    //   }),
    //   llRole: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   llBluetooth: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(2)]
    //   }),
    //   llLrWpan: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   llLrWpanType: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   llCelullar: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(1)]
    //   }),
    //   llNFC: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   llProducer: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   })
    // });
    this.frmStepFour = this.formBuilder.group({
      linkLayer: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = true;
    this.linkLayersService.getLinkLayers(this.pageSize, this.page);
    this.linkLayersSubs = this.linkLayersService
      .getLinkLayersUpdateListener()
      .subscribe((linkLayersData: { linkLayers: LinkLayerModel[]; maxLinkLayers: number }) => {
        this.isLoading = false;
        this.logger.log(this.componentName + 'not loading');
        this.logger.log(this.componentName + 'Link Layers', linkLayersData.linkLayers);
        this.linkLayers = linkLayersData.linkLayers;
        this.totalLinkLayers = linkLayersData.maxLinkLayers;
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
    //       if (deviceData.linLayerID) {
    //         this.step.setValue({
    //           id: this.device.linLayerID.id,
    //           llName: this.device.linLayerID.llName,
    //           llPriorityType: this.device.linLayerID.llPriorityType,
    //           llRole: this.device.linLayerID.llRole,
    //           llBluetooth: this.device.linLayerID.llBluetooth,
    //           llLrWpan: this.device.linLayerID.llLrWpan,
    //           llLrWpanType: this.device.linLayerID.llLrWpanType,
    //           llCelullar: this.device.linLayerID.llCelullar,
    //           llNFC: this.device.linLayerID.llNFC,
    //           llProducer: this.device.linLayerID.llProducer
    //         });
    //       }
    //     });
    //   } else {
    //     this.mode = 'create';
    //     this.deviceId = null;
    //   }
    // });
    // this.formService.stepReady(this.frmStepFour, 'four');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }
  onSave() {
    // this.saveStepFourForm.emit(this.frmStepFour);
    this.logger.log(this.componentName, this.frmStepFour);
  }
  ngOnDestroy() {
    this.linkLayersSubs.unsubscribe();
  }
}
