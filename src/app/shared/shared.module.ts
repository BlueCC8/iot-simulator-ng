import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    FlexLayoutModule,
    AngularMaterialModule,
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FlexLayoutModule
  ],
  exports: [
    FlexLayoutModule,
    AngularMaterialModule,
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FlexLayoutModule
  ]
})
export class SharedModule {}
