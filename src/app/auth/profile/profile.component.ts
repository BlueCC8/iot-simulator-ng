import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../auth.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  hide = true;
  user: User;
  form: FormGroup;
  isLoading = false;
  private authListenerSubs$ = new Subscription();

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
    this.isLoading = true;
    this.authService.getUserData().subscribe(userData => {
      this.isLoading = false;
      this.user = {
        username: userData.username,
        email: userData.email,
        password: ''
      };
      // * Set values
      this.form.setValue({
        username: this.user.username,
        email: this.user.email,
        password: this.user.password
      });
    });
  }
  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.isLoading = true;

    this.authService.updateUser(user);

    this.form.reset();
  }
  ngOnDestroy(): void {
    this.authListenerSubs$.unsubscribe();
  }
}
