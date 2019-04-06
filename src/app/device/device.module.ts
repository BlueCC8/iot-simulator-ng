import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { DeviceListComponent } from './device-list/device-list.component';

@NgModule({
  declarations: [DeviceCreateComponent, DeviceListComponent],
  imports: [ReactiveFormsModule, SharedModule]
})
export class DeviceModule {}
