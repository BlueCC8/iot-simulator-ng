import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../header/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;

  private authListenerSubs = new Subscription();
  @Output() sidenavClose = new EventEmitter();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  onLogout() {
    this.sidenavClose.emit();
    this.authService.logout();
  }
  onSidenavClose() {
    this.sidenavClose.emit();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
