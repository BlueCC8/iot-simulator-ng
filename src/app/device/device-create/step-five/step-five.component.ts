import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../device.service';
import { AuthService } from 'src/app/navigation/header/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../device.integrated-model';
@Component({
  selector: 'app-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.css']
})
export class StepFiveComponent implements OnInit, OnDestroy {
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
      wifiName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      wifiFrequancy: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      wifiRange: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      wifiDataRate: new FormControl(null, {
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
          if (this.device.linLayerID.llWifiID) {
            this.step.setValue({
              id: this.device.linLayerID.llWifiID.id,
              wifiName: this.device.linLayerID.llWifiID.wifiName,
              wifiFrequancy: this.device.linLayerID.llWifiID.wifiFrequancy,
              wifiRange: this.device.linLayerID.llWifiID.wifiRange,
              wifiDataRate: this.device.linLayerID.llWifiID.wifiDataRate
            });
          }
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
    this.formService.stepReady(this.step, 'five');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
