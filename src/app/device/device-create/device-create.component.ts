import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../navigation/header/auth/auth.service';
import { DeviceIntegratedModel } from '../device.integrated-model';
import { DevicesService } from '../device.service';
import { AppLayerModel } from 'src/app/applicationLayer/applicationLayer.model';
import { NetLayerModel } from 'src/app/networkLayer/networkLayer.model';
import { LinkLayerIntegratedModel } from 'src/app/linkLayer/linkLayer.integrated-model';
import { WifiModel } from 'src/app/wifi/wifi.model';
import { EthernetModel } from 'src/app/ethernet/ethernet.model';
@Component({
  selector: 'app-device-create',
  templateUrl: './device-create.component.html',
  styleUrls: ['/device-create.component.css']
})
export class DeviceCreateComponent implements OnInit, OnDestroy {
  device: DeviceIntegratedModel;
  appLayer: AppLayerModel;
  netLayer: NetLayerModel;
  linkLayer: LinkLayerIntegratedModel;
  wifi: WifiModel;
  ethernet: EthernetModel;

  transLayerArr: string[] = ['tcp', 'udp'];

  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  private mode = 'create';
  private deviceId: string;
  private authListenerSubs = new Subscription();
  constructor(
    public devicesService: DevicesService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
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
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('deviceId')) {
        this.mode = 'edit';
        this.deviceId = paramMap.get('deviceId');
        this.isLoading = true;
        // * Get instance
        this.devicesService.getDevice(this.deviceId, true).subscribe(deviceData => {
          this.isLoading = false;
          this.device = deviceData;
          // console.log(etherData.username);
          // console.log(this.ether.imagePath);
          // * Set values
          // this.form.setValue({
          //   title: this.ether.etherName,
          //   standard: this.ether.etherStandard,
          //   throughput: this.ether.etherDataRate,
          //   image: this.ether.imagePath
          // });
        });
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    // * Revalidate field
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
  onSaveEthernet() {
    if (this.form.invalid) {
      return;
    }
    // const device: Device = {
    //   id: null,
    //   devName: this.form.value.title,
    //   etherStandard: this.form.value.standard,
    //   etherDataRate: this.form.value.throughput,
    //   imagePath: this.form.value.image,
    //   username: null
    // };
    // console.log(ether);
    // this.isLoading = true;
    // if (this.mode === 'create') {
    //   this.devicesService.addDevice(this.device);
    // } else {
    //   ether.id = this.etherId;
    //   this.ethernetsService.updateEthernet(ether);
    // }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
