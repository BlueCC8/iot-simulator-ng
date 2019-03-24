import { NgModule } from '@angular/core';

import { BoardComponent } from './board/board.component';
import { ConfigurationListComponent } from './configuration/configuration-list/configuration-list.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PlaygroundComponent } from './playground.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BoardComponent,
    ConfigurationListComponent,
    FilterListComponent,
    SearchBarComponent,
    PlaygroundComponent
  ],
  imports: [SharedModule]
})
export class PlaygroundModule {}
