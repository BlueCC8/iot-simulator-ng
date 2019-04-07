import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { StepOneComponent } from './device-create/step-one/step-one.component';
import { StepTwoComponent } from './device-create/step-two/step-two.component';
import { DoneComponent } from './device-create/done/done.component';
import { StepThreeComponent } from './device-create/step-three/step-three.component';
import { StepFourComponent } from './device-create/step-four/step-four.component';
import { StepFiveComponent } from './device-create/step-five/step-five.component';
import { StepSixComponent } from './device-create/step-six/step-six.component';

@NgModule({
  declarations: [
    DeviceCreateComponent,
    DeviceListComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    DoneComponent
  ],
  imports: [ReactiveFormsModule, FormsModule, SharedModule]
})
export class DeviceModule {}
