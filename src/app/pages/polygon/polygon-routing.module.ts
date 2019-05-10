import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolygonCreateComponent } from './polygon-create/polygon-create.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { PolygonListComponent } from './polygon-list/polygon-list.component';

const routes: Routes = [
  {
    path: 'create',
    component: PolygonCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:polygonId',
    component: PolygonCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: PolygonListComponent,
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolygonRoutingModule {}
