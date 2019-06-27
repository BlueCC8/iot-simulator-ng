import { NgModule } from '@angular/core';
import { ZoomableDirective } from './directives/zoomable.directive';
import { DraggableDirective } from './directives/draggable.directive';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ZoomableDirective, DraggableDirective],
  imports: [SharedModule],
  exports: [ZoomableDirective, DraggableDirective]
})
export class D3Module {}
