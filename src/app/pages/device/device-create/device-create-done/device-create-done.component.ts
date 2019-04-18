import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../device-create-steps-form.service';
import { DevicesService } from '../../device.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../device.integrated-model';
import { NetLayersService } from 'src/app/core/networkLayer/networkLayer.service';
import { AppLayersService } from 'src/app/core/applicationLayer/applicationLayer.service';
import { LinkLayersService } from 'src/app/core/linkLayer/linkLayer.service';
import { WifisService } from 'src/app/core/wifi/wifi.service';
import { EthernetsService } from 'src/app/core/ethernet/ethernet.service';
import { Device } from '../../device.model';
import { LinkLayerModel } from 'src/app/core/linkLayer/linkLayer.model';
import { NGXLogger } from 'ngx-logger';
import { MatHorizontalStepper, MatStep, MatVerticalStepper } from '@angular/material';
import { AppLayerModel } from 'src/app/core/applicationLayer/applicationLayer.model';
import { NetLayerModel } from 'src/app/core/networkLayer/networkLayer.model';
import { WifiModel } from 'src/app/core/wifi/wifi.model';
import { EthernetModel } from 'src/app/core/ethernet/ethernet.model';

@Component({
  selector: 'app-device-create-done',
  templateUrl: 'device-create-done.component.html',
  styleUrls: ['device-create-done.component.css'],
  providers: [DeviceCreateSteptsFormService]
})
export class DeviceCreateDoneComponent implements OnInit, OnDestroy {
  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;
  stepFour: FormGroup;
  stepFive: FormGroup;
  stepSix: FormGroup;
  stepOneCompleted = false;
  stepTwoCompleted = false;
  stepThreeCompleted = false;
  stepFourCompleted = false;
  stepFiveCompleted = false;
  stepSixCompleted = false;

  isLoading = false;
  diagnostics = true;

  form: FormGroup;
  validCreateForm = false;
  device: Device;
  appLayer: AppLayerModel;
  netLayer: NetLayerModel;
  linkLayer: LinkLayerModel;
  ethernet: EthernetModel;
  wifi: WifiModel;
  private mode = 'create';
  private deviceId: string;
  private componentName = DeviceCreateDoneComponent.name + ' ';
  private authListenerSubs = new Subscription();
  @ViewChild(MatVerticalStepper) stepper: MatVerticalStepper;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private linLayerService: LinkLayersService,
    private devicesService: DevicesService,
    private logger: NGXLogger,
    public formService: DeviceCreateSteptsFormService
  ) {
    // this.form = this.formService.initDevice;
  }
  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('deviceId')) {
        this.mode = 'edit';
        this.deviceId = paramMap.get('deviceId');
        this.isLoading = false;
        // * Get instance
      } else {
        this.mode = 'create';
        this.deviceId = null;
      }
    });
  }

  keys(): Array<string> {
    return Object.keys(this.form);
  }

  onSaveStepOne(form: FormGroup) {
    this.logger.log(this.componentName, form);
    this.stepOne = form;
    this.stepOneCompleted = !form.invalid;
    this.logger.log(this.componentName, !form.invalid);
    this.logger.log(this.componentName, this.stepOneCompleted);
    this.validCreateForm = !form.invalid;
    const newDevice: Device = {
      id: this.deviceId,
      devName: form.get('devName').value,
      appLayerID: '',
      tranLayer: form.get('tranLayer').value,
      netLayerID: '',
      linLayerID: '',
      devProducer: form.get('devProducer').value,
      devPrice: form.get('devPrice').value,
      devImgUrl: form.get('devImgUrl').value,
      username: form.get('username').value
        ? form.get('username').value
        : this.authService.getUsername()
    };
    this.device = newDevice;
  }
  onSaveStepTwo(form: FormGroup) {
    this.logger.log(this.componentName, this.componentName, form);
    this.stepTwo = form;
    this.stepTwoCompleted = !form.invalid;
    this.logger.log(this.componentName, this.stepTwo);
    this.validCreateForm = !form.invalid;

    this.appLayer = form.get('appLayer').value;
  }
  onSaveStepThree(form: FormGroup) {
    this.logger.log(this.componentName, this.componentName, form);
    this.stepThree = form;
    this.stepThreeCompleted = !form.invalid;
    this.validCreateForm = !form.invalid;
    this.netLayer = form.get('netLayer').value;
  }
  onSaveStepFour(form: FormGroup) {
    this.logger.log(this.componentName, this.componentName, form);
    this.stepFour = form;
    this.stepFourCompleted = !form.invalid;
    this.validCreateForm = !form.invalid;
    this.linkLayer = form.get('linkLayer').value;
  }
  onSaveStepFive(form: FormGroup) {
    this.logger.log(this.componentName, this.componentName, form);
    this.stepFive = form;
    this.stepFiveCompleted = !form.invalid;
    this.validCreateForm = !form.invalid;
    this.wifi = form.get('wifi').value;
  }
  onSaveStepSix(form: FormGroup) {
    this.logger.log(this.componentName, this.componentName, form);
    this.stepSix = form;
    this.stepSixCompleted = !form.invalid;
    this.validCreateForm = !form.invalid;
    this.ethernet = form.get('ether').value;
  }
  onSubmit() {
    const isCompleted =
      this.stepOneCompleted &&
      this.stepTwoCompleted &&
      this.stepThreeCompleted &&
      this.stepFourCompleted &&
      this.stepFiveCompleted &&
      this.stepSixCompleted;

    if (!isCompleted) {
      return;
    }

    this.isLoading = true;
    this.linkLayer.llWifiID = this.wifi.id;
    this.linkLayer.llEthernetID = this.ethernet.id;

    if (this.mode === 'create') {
      // * Add new because it's a new configuration
      this.linLayerService.addLinLayer(this.linkLayer).subscribe(linkLayerId => {
        this.device.linLayerID = linkLayerId;
        this.device.appLayerID = this.appLayer.id;
        this.device.netLayerID = this.netLayer.id;

        this.devicesService.addDevice(this.device);
        this.isLoading = false;
      });
    } else {
      // this.logger.log(this.componentName, this.linkLayer);
      // * History updated feature
      this.linLayerService.addLinLayer(this.linkLayer).subscribe(linkLayerId => {
        this.device.linLayerID = linkLayerId;
        this.device.appLayerID = this.appLayer.id;
        this.device.netLayerID = this.netLayer.id;

        this.devicesService.updateDevice(this.device);
        this.isLoading = false;
      });
    }
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
