import { NgModule } from '@angular/core';

import { BoardComponent } from './board/board.component';
import { ConfigurationListComponent } from './configuration/configuration-list/configuration-list.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PlaygroundComponent } from './playground.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DevicePropertiesPipe } from './filter-list/device-properties.pipe';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    BoardComponent,
    ConfigurationListComponent,
    FilterListComponent,
    SearchBarComponent,
    PlaygroundComponent,
    DevicePropertiesPipe
  ],
  imports: [SharedModule, DragDropModule, ReactiveFormsModule],
  exports: [DevicePropertiesPipe]
})
export class PlaygroundModule {}
