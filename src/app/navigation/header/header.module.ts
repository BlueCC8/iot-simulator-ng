import { NgModule } from '@angular/core';

import { AboutComponent } from './about/about.component';
import { GuideComponent } from './guide/guide.component';
import { ExploreComponent } from './explore/explore.component';
import { HeaderComponent } from './header.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AboutComponent, GuideComponent, ExploreComponent, AboutComponent, HeaderComponent],
  imports: [SharedModule],
  exports: [HeaderComponent]
})
export class HeaderModule {}
