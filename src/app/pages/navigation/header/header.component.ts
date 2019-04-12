import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;

  private authListenerSubs = new Subscription();

  @Output() public sidenavToggle = new EventEmitter();

  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
