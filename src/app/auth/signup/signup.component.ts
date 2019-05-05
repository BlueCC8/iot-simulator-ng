import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../auth.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  hide = true;
  isLoading = false;
  private authStatusSub$: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub$ = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const user: User = {
      email: form.value.email,
      username: form.value.username,
      password: form.value.password
    };
    this.authService.createUser(user);
  }
  ngOnDestroy() {
    this.authStatusSub$.unsubscribe();
  }
}
