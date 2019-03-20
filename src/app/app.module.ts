import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './header/auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { EthernetModule } from './ethernet/ethernet.module';
import { AngularMaterialModule } from './angular-material.module';
import { AboutComponent } from './header/about/about.component';
import { ExploreComponent } from './header/explore/explore.component';
import { GuideComponent } from './header/guide/guide.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    ExploreComponent,
    GuideComponent,
    ErrorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    EthernetModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
