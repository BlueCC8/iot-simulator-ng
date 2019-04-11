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
  selector: 'app-ethernet-step-six',
  templateUrl: './ethernet-step-six.component.html',
  styleUrls: ['./ethernet-step-six.component.css']
})
export class EthernetStepSixComponent implements OnInit, OnDestroy {
  private componentName = EthernetStepSixComponent.name + ' ';
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
      etherName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      etherStandard: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      etherDataRate: new FormControl(null, {
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
          this.logger.log(this.componentName, this.device);
          // * Set values
          if (this.device.linLayerID.llEthernetID) {
            this.step.setValue({
              id: this.device.linLayerID.llEthernetID.id,
              etherName: this.device.linLayerID.llEthernetID.etherName,
              etherStandard: this.device.linLayerID.llEthernetID.etherStandard,
              etherDataRate: this.device.linLayerID.llEthernetID.etherDataRate
            });
          }
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'six');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
