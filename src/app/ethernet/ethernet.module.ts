import { NgModule } from '@angular/core';
import { EthernetCreateComponent } from './ethernet-create/ethernet-create.component';
import { EthernetListComponent } from './ethernet-list/ethernet-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [EthernetCreateComponent, EthernetListComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, RouterModule]
})
export class EthernetModule {}
