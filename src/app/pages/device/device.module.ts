import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DeviceListComponent } from './device-list/device-list.component';

import { DeviceCreateStepsModule } from './device-create/device-create-steps/device-create-steps.module';

@NgModule({
  declarations: [DeviceListComponent],
  imports: [ReactiveFormsModule, FormsModule, SharedModule, DeviceCreateStepsModule]
})
export class DeviceModule {}
