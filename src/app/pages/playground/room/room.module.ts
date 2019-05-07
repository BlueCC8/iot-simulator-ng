import { NgModule } from '@angular/core';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomListPipe } from './room-list/room-list.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RoomCreateComponent, RoomListComponent, RoomListPipe],
  imports: [SharedModule, ReactiveFormsModule, FormsModule],
  exports: [RoomCreateComponent, RoomListComponent, RoomListPipe]
})
export class RoomModule {}
