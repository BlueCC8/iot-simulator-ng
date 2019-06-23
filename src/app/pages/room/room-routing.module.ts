import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomListComponent } from './room-list/room-list.component';

const routes: Routes = [
  {
    path: 'create',
    component: RoomCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:roomId',
    component: RoomCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: RoomListComponent,
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule {}
