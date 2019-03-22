import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { ConfigurationListComponent } from './configuration/configuration-list/configuration-list.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PlaygroundComponent } from './playground.component';

@NgModule({
  declarations: [
    BoardComponent,
    ConfigurationListComponent,
    FilterListComponent,
    SearchBarComponent,
    PlaygroundComponent
  ],
  imports: [CommonModule, AngularMaterialModule, RouterModule]
})
export class PlaygroundModule {}
