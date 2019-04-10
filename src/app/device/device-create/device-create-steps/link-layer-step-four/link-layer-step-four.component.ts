import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
@Component({
  selector: 'app-link-layer-step-four',
  templateUrl: './link-layer-step-four.component.html',
  styleUrls: ['./link-layer-step-four.component.css']
})
export class LinkLayerStepFourComponent implements OnInit, OnDestroy {
  step: FormGroup;
  imagePreview: string;
  isLoading = false;
  device: DeviceIntegratedModel;
  private authListenerSubs = new Subscription();
  mode: string;
  deviceId: string;
  netLayerGroup: FormGroup;
  isPopulated = true;
  ngOnInit() {}

  constructor(
    public devicesService: DevicesService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {
    this.step = this.formBuilder.group({
      id: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llPriorityType: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      llRole: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llBluetooth: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      llLrWpan: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llLrWpanType: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llCelullar: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      llNFC: new FormControl(null, {
        validators: [Validators.required]
      }),
      llProducer: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('deviceId')) {
        this.mode = 'edit';
        this.deviceId = paramMap.get('deviceId');
        this.isLoading = true;
        // * Get instance
        this.devicesService.getDevice(this.deviceId, this.isPopulated).subscribe(deviceData => {
          this.isLoading = false;
          this.device = deviceData;
          this.device = this.devicesService.removeUndefProp(this.device);
          console.log(this.device);
          // * Set values
          this.step.setValue({
            id: this.device.linLayerID.id,
            llName: this.device.linLayerID.llName,
            llPriorityType: this.device.linLayerID.llPriorityType,
            llRole: this.device.linLayerID.llRole,
            llBluetooth: this.device.linLayerID.llBluetooth,
            llLrWpan: this.device.linLayerID.llLrWpan,
            llLrWpanType: this.device.linLayerID.llLrWpanType,
            llCelullar: this.device.linLayerID.llCelullar,
            llNFC: this.device.linLayerID.llNFC,
            llProducer: this.device.linLayerID.llProducer
          });
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'four');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
