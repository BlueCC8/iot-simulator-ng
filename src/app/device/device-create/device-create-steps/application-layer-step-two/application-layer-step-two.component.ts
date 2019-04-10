import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../device.integrated-model';
import { mimeType } from '../../mime-type.validator';
import { AppLayerModel } from 'src/app/applicationLayer/applicationLayer.model';

@Component({
  selector: 'app-application-layer-step-two',
  templateUrl: './application-layer-step-two.component.html',
  styleUrls: ['./application-layer-step-two.component.css']
})
export class ApplicationLayerStepTwoComponent implements OnInit, OnDestroy {
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
    private formService: FormService
  ) {
    this.step = this.formBuilder.group({
      id: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      alName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      alHTTP: new FormControl(null, {
        validators: [Validators.required]
      }),
      alCoAp: new FormControl(null, {
        validators: [Validators.required]
      }),
      alWebSocket: new FormControl(null, {
        validators: [Validators.required]
      }),
      alMQTTE: new FormControl(null, {
        validators: [Validators.required]
      }),
      alDDS: new FormControl(null, {
        validators: [Validators.required]
      }),
      alAMQP: new FormControl(null, {
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
          console.log(this.device);
          // console.log(etherData.username);
          // console.log(this.ether.imagePath);
          // * Set values
          this.step.setValue({
            id: this.device.appLayerID.id,
            alName: this.device.appLayerID.alName,
            alHTTP: this.device.appLayerID.alHTTP,
            alCoAp: this.device.appLayerID.alCoAp,
            alWebSocket: this.device.appLayerID.alWebSocket,
            alMQTTE: this.device.appLayerID.alMQTTE,
            alDDS: this.device.appLayerID.alDDS,
            alAMQP: this.device.appLayerID.alAMQP
          });
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'two');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
