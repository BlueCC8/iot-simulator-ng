import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { NGXLogger } from 'ngx-logger';
@Component({
  selector: 'app-network-step-three',
  templateUrl: './network-step-three.component.html',
  styleUrls: ['./network-step-three.component.css']
})
export class NetworkStepThreeComponent implements OnInit, OnDestroy {
  private componentName = NetworkStepThreeComponent.name + ' ';
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
    private formService: DeviceCreateSteptsFormService,
    private logger: NGXLogger
  ) {
    this.step = this.formBuilder.group({
      id: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      nlName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      nlIPv4: new FormControl(null, {
        validators: [Validators.required]
      }),
      nlIPv6: new FormControl(null, {
        validators: [Validators.required]
      }),
      nlZig_LoWpan: new FormControl(null, {
        validators: [Validators.required]
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
          this.logger.log(this.componentName, this.device);
          // * Set values
          this.step.setValue({
            id: this.device.netLayerID.id,
            nlName: this.device.netLayerID.nlName,
            nlIPv4: this.device.netLayerID.nlIPv4,
            nlIPv6: this.device.netLayerID.nlIPv6,
            nlZig_LoWpan: this.device.netLayerID.nlZig_LoWpan
          });
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'three');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
