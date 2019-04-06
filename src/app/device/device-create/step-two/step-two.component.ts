import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormService } from '../form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../device.service';
import { AuthService } from 'src/app/navigation/header/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../device.integrated-model';
import { mimeType } from '../mime-type.validator';
import { AppLayerModel } from 'src/app/applicationLayer/applicationLayer.model';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit, OnDestroy {
  step: FormGroup;
  imagePreview: string;
  isLoading = false;
  device: DeviceIntegratedModel;
  private authListenerSubs = new Subscription();
  mode: string;
  deviceId: string;

  appLayerGroup: FormGroup;
  netLayerGroup: FormGroup;
  linLayerGroup: FormGroup;
  wifiGroup: FormGroup;
  etherGroup: FormGroup;

  ngOnInit() {
    this.appLayerGroup = new FormGroup({
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

    this.netLayerGroup = new FormGroup({
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
    this.wifiGroup = new FormGroup({
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
    this.etherGroup = new FormGroup({
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
    this.linLayerGroup = new FormGroup({
      llName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llPriorityType: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llRole: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llBluetooth: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llLrWpan: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llLrWpanType: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llCelullar: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      llNFC: new FormControl(null, {
        validators: [Validators.required]
      }),
      llProducer: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
  }

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
    this.formService.stepReady(this.step, 'two');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
