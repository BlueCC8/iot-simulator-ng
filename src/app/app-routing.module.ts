import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EthernetListComponent } from './ethernet/ethernet-list/ethernet-list.component';
import { EthernetCreateComponent } from './ethernet/ethernet-create/ethernet-create.component';
import { AuthGuard } from './navigation/header/auth/auth.guard';
import { ExploreComponent } from './navigation/header/explore/explore.component';
import { GuideComponent } from './navigation/header/guide/guide.component';
import { AboutComponent } from './navigation/header/about/about.component';
import { PlaygroundComponent } from './playground/playground.component';

const routes: Routes = [
  {
    path: '',
    component: EthernetListComponent
  },
  {
    path: 'create',
    component: EthernetCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:etherId',
    component: EthernetCreateComponent,
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
    loadChildren: './navigation/header/auth/auth.module#AuthModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
