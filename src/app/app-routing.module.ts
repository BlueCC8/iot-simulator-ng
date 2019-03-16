import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EthernetListComponent } from './ethernet/ethernet-list/ethernet-list.component';
import { EthernetCreateComponent } from './ethernet/ethernet-create/ethernet-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

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
    // * Lazy laoding with #Name of module
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
