import { NgModule } from '@angular/core';

import { BoardComponent } from './board/board.component';
import { SetupListComponent } from './setup/setup-list/setup-list.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PlaygroundComponent } from './playground.component';
import { SharedModule } from '../../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { FilterListDevicePropertiesPipe } from './filter-list/filter-list-device-properties.pipe';
import { DeleteDeviceDialogComponent } from './delete-device-dialog/delete-device-dialog.component';
import { RoomModule } from '../room/room.module';
@NgModule({
  declarations: [
    BoardComponent,
    SaveDialogComponent,
    DeleteDeviceDialogComponent,
    SetupListComponent,
    FilterListComponent,
    SearchBarComponent,
    PlaygroundComponent,
    FilterListDevicePropertiesPipe,
    BottomSheetComponent
  ],
  imports: [SharedModule, DragDropModule, ReactiveFormsModule, FormsModule, RoomModule],
  exports: [FilterListDevicePropertiesPipe]
})
export class PlaygroundModule {}
