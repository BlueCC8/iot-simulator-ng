import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { EthernetModule } from './ethernet/ethernet.module';
import { PlaygroundModule } from './playground/playground.module';
import { SharedModule } from './shared/shared.module';
import { SaveDialogComponent } from './playground/save-dialog/save-dialog.component';
import { BottomSheetComponent } from './playground/bottom-sheet/bottom-sheet.component';
import { DeviceModule } from './device/device.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { NavigationModule } from './navigation/navigation.module';
import { FooterComponent } from './footer/footer.component';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  declarations: [AppComponent, ErrorComponent, FooterComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    EthernetModule,
    PlaygroundModule,
    DeviceModule,
    HttpClientModule,
    NavigationModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
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
