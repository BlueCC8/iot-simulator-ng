import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomSelectListPipe } from './room-select-list/room-select-list.pipe';
import { RoomSelectListComponent } from './room-select-list/room-select-list.component';
import { RoomListComponent } from './room-list/room-list.component';

@NgModule({
  declarations: [
    RoomCreateComponent,
    RoomSelectListComponent,
    RoomSelectListPipe,
    RoomListComponent
  ],
  imports: [SharedModule, ReactiveFormsModule, FormsModule],
  exports: [RoomCreateComponent, RoomSelectListComponent, RoomSelectListPipe]
})
export class RoomModule {}
