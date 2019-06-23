import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EthernetCreateComponent } from './core/obsolete/ethernet-create/ethernet-create.component';
import { AuthGuard } from './auth/auth.guard';
import { ExploreComponent } from './pages/navigation/header/explore/explore.component';
import { GuideComponent } from './pages/navigation/header/guide/guide.component';
import { AboutComponent } from './pages/navigation/header/about/about.component';
import { PlaygroundComponent } from './pages/playground/playground.component';

import { DeviceListComponent } from './pages/device/device-list/device-list.component';
import { DeviceCreateDoneComponent } from './pages/device/device-create/device-create-done/device-create-done.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceListComponent
  },
  {
    path: 'create',
    component: DeviceCreateDoneComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'createTest',
    component: EthernetCreateComponent
  },
  {
    path: 'edit/:deviceId',
    component: DeviceCreateDoneComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'explore',
    component: ExploreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'guide',
    component: GuideComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'playground',
    component: PlaygroundComponent,
    canActivate: [AuthGuard]
  },
  {
    // * Lazy loading with #Name of module
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    // * Lazy loading with #Name of module
    path: 'polygon',
    loadChildren: './pages/polygon/polygon.module#PolygonModule'
  },
  {
    // * Lazy loading with #Name of module
    path: 'room',
    loadChildren: './pages/room/room.module#RoomModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
