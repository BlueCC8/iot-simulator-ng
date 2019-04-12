import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { mimeType } from '../../mime-type.validator';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { DevicesService } from '../../../device.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-basic-details-step-one',
  templateUrl: './basic-details-step-one.component.html',
  styleUrls: ['./basic-details-step-one.component.css']
})
export class BasicDetailsStepOneComponent implements OnInit, OnDestroy {
  private componentName = BasicDetailsStepOneComponent.name + ' ';
  step: FormGroup;
  imagePreview: string;
  isLoading = false;
  device: DeviceIntegratedModel;
  private authListenerSubs = new Subscription();
  mode: string;
  deviceId: string;
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
      devName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      tranLayer: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      devPrice: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      devProducer: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      devImgUrl: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      username: new FormControl(null, {
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
          this.step.setValue({
            id: this.device.id,
            devName: this.device.devName,
            tranLayer: this.device.tranLayer,
            devPrice: this.device.devPrice,
            devProducer: this.device.devProducer,
            devImgUrl: this.device.devImgUrl,
            username: this.device.username
          });
          if (this.device.devImgUrl) {
            this.imagePreview = this.device.devImgUrl;
            this.step.patchValue({ devImgUrl: this.device.devImgUrl });
          }
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'one');
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.step.patchValue({ devImgUrl: file });
    // * Revalidate field
    this.step.get('devImgUrl').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
