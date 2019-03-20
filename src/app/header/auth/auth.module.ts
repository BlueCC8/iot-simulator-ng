import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ProfileComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
