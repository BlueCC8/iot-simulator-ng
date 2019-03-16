import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './auth.model';

import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserDto } from './auth.dto';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private token: string;
  private tokenTimer: any;
  private username: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  getToken() {
    return this.token;
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getUsername() {
    return this.username;
  }
  createUser(userData: User) {
    this.http.post<{ mess: string; auth: boolean }>(BACKEND_URL + 'signup', userData).subscribe(
      responseData => {
        // console.log(responseData);
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }
  loginUser(userData: User) {
    this.http
      .post<{ user: UserDto; token: string; expiresIn: number }>(BACKEND_URL + 'login', userData)
      .subscribe(
        responseData => {
          this.token = responseData.token;
          if (this.token) {
            const expiresIn = responseData.expiresIn;
            this.setAuthTimer(expiresIn);
            this.isAuthenticated = true;
            this.username = responseData.user.username;
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            this.saveAuthData(this.token, expirationDate, this.username);
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        error => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }
  autoAuthUser() {
    const authInfo = this.getAuthData();
    const now = new Date();
    if (!authInfo) {
      return;
    }
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.username = authInfo.username;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.http
      .post<{ mess: string; auth: boolean }>(BACKEND_URL + 'logout', null)
      .subscribe(responseData => {
        console.log(responseData);
        this.token = null;
        this.isAuthenticated = false;
        this.username = null;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
      });
  }
  private setAuthTimer(duration: number) {
    console.log(duration);
    this.tokenTimer = window.setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('username', username);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('username');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const username = localStorage.getItem('username');

    if (!token || !expirationDate || !username) {
      return;
    } else {
      return { username, token, expirationDate: new Date(expirationDate) };
    }
  }
}
