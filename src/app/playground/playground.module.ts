import { NgModule } from '@angular/core';

import { BoardComponent } from './board/board.component';
import { SetupListComponent } from './setup/setup-list/setup-list.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PlaygroundComponent } from './playground.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DevicePropertiesPipe } from './filter-list/device-properties.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SaveDialogComponent } from './board/save-dialog/save-dialog.component';
@NgModule({
  declarations: [
    BoardComponent,
    SaveDialogComponent,
    SetupListComponent,
    FilterListComponent,
    SearchBarComponent,
    PlaygroundComponent,
    DevicePropertiesPipe
  ],
  imports: [SharedModule, DragDropModule, ReactiveFormsModule, FormsModule],
  exports: [DevicePropertiesPipe]
})
export class PlaygroundModule {}
