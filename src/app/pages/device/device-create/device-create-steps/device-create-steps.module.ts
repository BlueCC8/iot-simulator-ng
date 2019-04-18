import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { DeviceCreateDoneComponent } from '../device-create-done/device-create-done.component';
import { ApplicationLayerStepTwoComponent } from './application-layer-step-two/application-layer-step-two.component';
import { BasicDetailsStepOneComponent } from './basic-details-step-one/basic-details-step-one.component';
import { EthernetStepSixComponent } from './ethernet-step-six/ethernet-step-six.component';
import { LinkLayerStepFourComponent } from './link-layer-step-four/link-layer-step-four.component';
import { NetworkStepThreeComponent } from './network-step-three/network-step-three.component';
import { WifiStepFiveComponent } from './wifi-step-five/wifi-step-five.component';
import { ApplicationLayerPipe } from './application-layer-step-two/application-layer.pipe';
import { NetworkLayerPipe } from './network-step-three/network-layer.pipe';
import { EthernetPipe } from './ethernet-step-six/ethernet.pipe';
import { WifiPipe } from './wifi-step-five/wifi.pipe';
import { LinkLayerPipe } from './link-layer-step-four/link-layer.pipe';

@NgModule({
  declarations: [
    DeviceCreateDoneComponent,
    ApplicationLayerStepTwoComponent,
    BasicDetailsStepOneComponent,
    EthernetStepSixComponent,
    LinkLayerStepFourComponent,
    NetworkStepThreeComponent,
    WifiStepFiveComponent,
    ApplicationLayerPipe,
    NetworkLayerPipe,
    EthernetPipe,
    WifiPipe,
    LinkLayerPipe
  ],
  imports: [ReactiveFormsModule, FormsModule, SharedModule]
})
export class DeviceCreateStepsModule {}
