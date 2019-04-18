import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class DeviceCreateSteptsFormService {
  private componentName = DeviceCreateSteptsFormService.name + ' ';

  private stepOneSource: Subject<FormGroup> = new Subject();
  stepOne: Observable<FormGroup> = this.stepOneSource.asObservable();

  private stepTwoSource: Subject<FormGroup> = new Subject();
  stepTwo: Observable<FormGroup> = this.stepTwoSource.asObservable();

  private stepThreeSource: Subject<FormGroup> = new Subject();
  stepThree: Observable<FormGroup> = this.stepThreeSource.asObservable();

  private stepFourSource: Subject<FormGroup> = new Subject();
  stepFour: Observable<FormGroup> = this.stepFourSource.asObservable();

  private stepFiveSource: Subject<FormGroup> = new Subject();
  stepFive: Observable<FormGroup> = this.stepFiveSource.asObservable();

  private stepSixSource: Subject<FormGroup> = new Subject();
  stepSix: Observable<FormGroup> = this.stepSixSource.asObservable();

  initAppLayer: FormGroup = this.formBuilderAppLayer.group({
    id: '',
    alName: '',
    alHTTP: false,
    alCoAp: false,
    alWebSocket: false,
    alMQTTE: false,
    alDDS: false,
    alAMQP: false
  });
  initNetLayer: FormGroup = this.formBuilderNetLayer.group({
    id: '',
    nlName: '',
    nlIPv4: false,
    nlIPv6: false,
    nlZig_LoWpan: ''
  });
  initWifi: FormGroup = this.formBuilderWifi.group({
    id: '',
    wifiName: '',
    wifiFrequancy: '',
    wifiRange: '',
    wifiDataRate: ''
  });
  initEthernet: FormGroup = this.formBuilderEthernet.group({
    id: '',
    etherName: '',
    etherStandard: '',
    etherDataRate: '',
    imagePath: '',
    username: ''
  });

  initLinkLayer: FormGroup = this.formBuilderLink.group({
    id: '',
    llName: '',
    llPriorityType: '',
    llRole: '',
    llBluetooth: '',
    llLrWpan: '',
    llLrWpanType: '',
    llCelullar: '',
    llNFC: false,
    llProducer: '',
    llWifiID: this.initWifi,
    llEthernetID: this.initEthernet
  });
  initDevice: FormGroup = this.formBuilderDevice.group({
    id: '',
    devName: '',
    tranLayer: '',
    devPrice: '',
    devImgUrl: '',
    devProducer: '',
    username: '',
    appLayerID: this.initAppLayer,
    netLayerID: this.initNetLayer,
    linLayerID: this.initLinkLayer
  });

  constructor(
    private formBuilderDevice: FormBuilder,
    private formBuilderLink: FormBuilder,
    private formBuilderEthernet: FormBuilder,
    private formBuilderWifi: FormBuilder,
    private formBuilderNetLayer: FormBuilder,
    private formBuilderAppLayer: FormBuilder,
    private logger: NGXLogger
  ) {
    this.stepOne.subscribe(
      form =>
        form.valueChanges.subscribe(
          val => {
            const device = this.initDevice.value;
            device.id = val.id;
            device.devName = val.devName;
            device.tranLayer = val.tranLayer;
            device.devPrice = val.devPrice;
            device.devImgUrl = val.devImgUrl;
            device.devProducer = val.devProducer;
            device.username = val.username;
          },
          error => {
            this.logger.error(this.componentName + error);
          }
        ),
      error => {
        this.logger.error(this.componentName + error);
      }
    );
    this.stepTwo.subscribe(
      form => {
        this.initAppLayer = form;
        this.logger.log(this.componentName, this.initAppLayer);
      },
      error => {
        this.logger.error(this.componentName + error);
      }
    );
    this.stepThree.subscribe(
      form => (this.initNetLayer = form),
      error => {
        this.logger.error(this.componentName + error);
      }
    );
    this.stepFour.subscribe(
      form => (this.initLinkLayer = form),
      error => {
        this.logger.error(this.componentName + error);
      }
    );
    this.stepFive.subscribe(
      form => (this.initWifi = form),
      error => {
        this.logger.error(this.componentName + error);
      }
    );
    this.stepSix.subscribe(
      form => (this.initEthernet = form),
      error => {
        this.logger.error(this.componentName + error);
      }
    );
  }

  stepReady(form: FormGroup, part) {
    switch (part) {
      case 'one':
        {
          this.stepOneSource.next(form);
        }
        break;
      case 'two':
        {
          this.stepTwoSource.next(form);
        }
        break;
      case 'three':
        {
          this.stepThreeSource.next(form);
        }
        break;
      case 'four':
        {
          this.stepFourSource.next(form);
        }
        break;
      case 'five':
        {
          this.stepFiveSource.next(form);
        }
        break;
      case 'six': {
        this.stepSixSource.next(form);
      }
    }
  }
}
