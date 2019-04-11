import {
  CanActivate,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class AuthGuard implements CanActivate {
  private componentName = AuthGuard.name + ' ';
  constructor(
    private authService: AuthService,
    private router: Router,
    private logger: NGXLogger
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = this.authService.getIsAuthenticated();
    this.logger.log(this.componentName + 'Authenticated=', isAuth);
    if (!isAuth) {
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }
}
