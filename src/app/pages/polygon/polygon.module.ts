import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PolygonCreateComponent } from './polygon-create/polygon-create.component';
import { PolygonRoutingModule } from './polygon-routing.module';
import { PolygonSelectListComponent } from './polygon-select-list/polygon-select-list.component';
import { PolygonSelectListPipe } from './polygon-select-list/polygon-select-list.pipe';

@NgModule({
  declarations: [PolygonCreateComponent, PolygonSelectListComponent, PolygonSelectListPipe],
  imports: [SharedModule, ReactiveFormsModule, FormsModule, PolygonRoutingModule],
  exports: [PolygonCreateComponent, PolygonSelectListPipe, PolygonSelectListComponent]
})
export class PolygonModule {}
