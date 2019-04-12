import { NgModule } from '@angular/core';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { HeaderModule } from './header/header.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../shared/angular-material.module';

@NgModule({
  declarations: [SidenavListComponent],
  imports: [SharedModule, HeaderModule],
  exports: [HeaderModule, SidenavListComponent]
})
export class NavigationModule {}
