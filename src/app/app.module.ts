import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { EthernetModule } from './ethernet/ethernet.module';
import { AngularMaterialModule } from './shared/angular-material.module';
import { AboutComponent } from './navigation/header/about/about.component';
import { ExploreComponent } from './navigation/header/explore/explore.component';
import { GuideComponent } from './navigation/header/guide/guide.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { PlaygroundModule } from './playground/playground.module';
import { SharedModule } from './shared/shared.module';
import { SaveDialogComponent } from './playground/save-dialog/save-dialog.component';
import { BottomSheetComponent } from './playground/bottom-sheet/bottom-sheet.component';
import { DeviceModule } from './device/device.module';
import { NGXLogger, LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { HeaderModule } from './navigation/header/header.module';
import { NavigationModule } from './navigation/navigation.module';
@NgModule({
  declarations: [AppComponent, ErrorComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    EthernetModule,
    PlaygroundModule,
    DeviceModule,
    HttpClientModule,
    HeaderModule,
    NavigationModule,
    SharedModule,

    LoggerModule.forRoot({
      level: !environment.production ? NgxLoggerLevel.LOG : NgxLoggerLevel.OFF,
      // serverLogLevel
      serverLogLevel: NgxLoggerLevel.OFF
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, SaveDialogComponent, BottomSheetComponent]
})
export class AppModule {}
