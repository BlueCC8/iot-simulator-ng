import { NgModule } from '@angular/core';
import { EthernetCreateComponent } from './ethernet-create/ethernet-create.component';
import { EthernetListComponent } from './ethernet-list/ethernet-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [EthernetCreateComponent, EthernetListComponent],
  imports: [ReactiveFormsModule, SharedModule]
})
export class EthernetModule {}
