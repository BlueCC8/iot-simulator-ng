import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        // console.log(error.error.message);
        if (error.error.message) {
          errorMessage = error.error.message.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        // console.log(error.error.message);
        // alert(error.error.message.message);
        return throwError(error);
      })
    );
  }
}
