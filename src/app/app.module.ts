import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './core/interceptors/error-interceptor';
import { ErrorComponent } from './core/error/error.component';
import { EthernetModule } from './core/ethernet/ethernet.module';
import { PlaygroundModule } from './pages/playground/playground.module';
import { SharedModule } from './shared/shared.module';
import { SaveDialogComponent } from './pages/playground/save-dialog/save-dialog.component';
import { BottomSheetComponent } from './pages/playground/bottom-sheet/bottom-sheet.component';
import { DeviceModule } from './pages/device/device.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { NavigationModule } from './pages/navigation/navigation.module';
import { FooterComponent } from './pages/footer/footer.component';
import { AngularFireModule } from '@angular/fire';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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
    // AngularFireModule.initializeApp(environment.firebase),
    LoggerModule.forRoot({
      level: !environment.production ? NgxLoggerLevel.LOG : NgxLoggerLevel.OFF,
      // serverLogLevel
      serverLogLevel: NgxLoggerLevel.OFF
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, SaveDialogComponent, BottomSheetComponent]
})
export class AppModule {}
