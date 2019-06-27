import { NgModule } from '@angular/core';
import { GraphComponent } from './graph/graph.component';
import { NodeVisualComponent } from './shared/node-visual/node-visual.component';
import { LinkVisualComponent } from './shared/link-visual/link-visual.component';
import { D3Module } from '../d3/d3.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GraphComponent, NodeVisualComponent, LinkVisualComponent],
  imports: [D3Module, SharedModule],
  exports: [GraphComponent]
})
export class VisualsModule {}
