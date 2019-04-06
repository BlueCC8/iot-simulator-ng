import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { StepOneComponent } from './device-create/step-one/step-one.component';
import { StepTwoComponent } from './device-create/step-two/step-two.component';
import { DoneComponent } from './device-create/done/done.component';
import { TextInputComponent } from './device-create/text-input/text-input.component';
import { StepThreeComponent } from './device-create/step-three/step-three.component';

@NgModule({
  declarations: [
    DeviceCreateComponent,
    DeviceListComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    DoneComponent,
    TextInputComponent
  ],
  imports: [ReactiveFormsModule, FormsModule, SharedModule]
})
export class DeviceModule {}
