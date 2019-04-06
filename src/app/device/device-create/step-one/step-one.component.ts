import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../form.service';
import { mimeType } from '../mime-type.validator';
import { DeviceIntegratedModel } from '../../device.integrated-model';
import { DevicesService } from '../../device.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/navigation/header/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent implements OnInit, OnDestroy {
  step: FormGroup;
  imagePreview: string;
  isLoading = false;
  device: DeviceIntegratedModel;
  private authListenerSubs = new Subscription();
  mode: string;
  deviceId: string;

  ngOnInit() {}

  constructor(
    public devicesService: DevicesService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {
    this.step = this.formBuilder.group({
      devName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      tranLayer: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      devPrice: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      devImgUrl: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
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
        this.devicesService.getDevice(this.deviceId).subscribe(deviceData => {
          this.isLoading = false;
          this.device = deviceData;
          this.device = this.devicesService.removeUndefProp(this.device);
          console.log(this.device);
          // console.log(etherData.username);
          // console.log(this.ether.imagePath);
          // * Set values
          this.step.setValue({
            devName: this.device.devName,
            tranLayer: this.device.tranLayer,
            devPrice: this.device.devPrice,
            devImgUrl: this.device.devImgUrl
          });
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'one');
  }

  // change(title) {
  //   this.step.patchValue({ extraName: title });
  // }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.step.patchValue({ image: file });
    // * Revalidate field
    this.step.get('image').updateValueAndValidity();
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
