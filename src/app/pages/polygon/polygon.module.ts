import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PolygonCreateComponent } from './polygon-create/polygon-create.component';
import { PolygonRoutingModule } from './polygon-routing.module';

@NgModule({
  declarations: [PolygonCreateComponent],
  imports: [SharedModule, ReactiveFormsModule, FormsModule, PolygonRoutingModule],
  exports: [PolygonCreateComponent]
})
export class PolygonModule {}
