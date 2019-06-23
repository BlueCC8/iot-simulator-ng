import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceCreateSteptsFormService } from '../../device-create-steps-form.service';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../../../../core/services/device.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceIntegratedModel } from '../../../../../core/models/device.integrated-model';
import { NGXLogger } from 'ngx-logger';
import { EthernetsService } from 'src/app/core/services/ethernet.service';
import { EthernetModel } from 'src/app/core/models/ethernet.model';
@Component({
  selector: 'app-ethernet-step-six',
  templateUrl: './ethernet-step-six.component.html',
  styleUrls: ['./ethernet-step-six.component.css']
})
export class EthernetStepSixComponent implements OnInit, OnDestroy {
  private componentName = EthernetStepSixComponent.name + ' ';
  frmStepSix: FormGroup;
  imagePreview: string;
  isLoading = false;
  ethers: EthernetModel[];
  mode: string;
  deviceId: string;
  netLayerGroup: FormGroup;
  isPopulated = true;
  pageSize = null;
  page = null;
  totalEthers = 0;
  private ethernetsSubs$ = new Subscription();
  @Output() saveStepSixForm = new EventEmitter<FormGroup>();

  ngOnInit() {}

  constructor(
    public ethernetsService: EthernetsService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formService: DeviceCreateSteptsFormService,
    private logger: NGXLogger
  ) {
    // this.step = this.formBuilder.group({
    //   id: new FormControl(null, {}),
    //   etherName: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   etherStandard: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   etherDataRate: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   })
    // });
    this.frmStepSix = this.formBuilder.group({
      ether: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.isLoading = true;
    this.ethernetsService.getEthernets(this.pageSize, this.page);
    this.ethernetsSubs$ = this.ethernetsService
      .getEthernetUpdateListener()
      .subscribe((ethersData: { ethers: EthernetModel[]; maxEthers: number }) => {
        this.isLoading = false;
        this.logger.log(this.componentName + 'not loading');
        this.logger.log(this.componentName + 'Ethers', ethersData.ethers);
        this.ethers = ethersData.ethers;
        this.totalEthers = ethersData.maxEthers;
      });
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has('deviceId')) {
    //     this.mode = 'edit';
    //     this.deviceId = paramMap.get('deviceId');
    //     this.isLoading = true;
    //     // * Get instance
    //     this.devicesService.getDevice(this.deviceId, this.isPopulated).subscribe(deviceData => {
    //       this.isLoading = false;
    //       this.device = deviceData;
    //       this.device = this.devicesService.removeUndefProp(this.device);
    //       this.logger.log(this.componentName, this.device);
    //       // * Set values
    //       if (this.device.linLayerID.llEthernetID) {
    //         this.step.setValue({
    //           id: this.device.linLayerID.llEthernetID.id,
    //           etherName: this.device.linLayerID.llEthernetID.etherName,
    //           etherStandard: this.device.linLayerID.llEthernetID.etherStandard,
    //           etherDataRate: this.device.linLayerID.llEthernetID.etherDataRate
    //         });
    //       }
    //     });
    //   } else {
    //     this.mode = 'create';
    //     this.deviceId = null;
    //   }
    // });
    // this.formService.stepReady(this.frmStepSix, 'six');
    // this.formService.stepReady(this.appLayerGroup, 'two');
  }
  onSave() {
    // this.saveStepSixForm.emit(this.frmStepSix);
    this.logger.log(this.componentName, this.frmStepSix);
  }
  ngOnDestroy() {
    this.ethernetsSubs$.unsubscribe();
  }
}
