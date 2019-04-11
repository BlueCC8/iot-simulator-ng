import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';
import { NGXLogger } from 'ngx-logger';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private componentName = ErrorInterceptor.name + ' ';
  constructor(private dialog: MatDialog, private logger: NGXLogger) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        this.logger.error(this.componentName, error.error.message);
        if (error.error.message) {
          errorMessage = error.error.message.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        this.logger.error(this.componentName, error.error.message);

        return throwError(error);
      })
    );
  }
}
