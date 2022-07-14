import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMessage?: string = undefined;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.isLoading.next(true);
      this.errorMessage = '';

      setTimeout(() => {
        let username = this.loginForm.get('username')?.value;
        let password = this.loginForm.get('password')?.value;

        this.auth.login(
          username,
          password,
          () => {
            this.router.navigateByUrl('/');
          },
          (err: HttpErrorResponse) => {
            if (err.status == 500) {
              this.errorMessage =
                'The server responded with an Internal Error (500)';
            } else {
              this.errorMessage = err.error['detail'];
              for (let field in err.error) {
                console.log(`${field}: ${err.error[field]}`);
                this.loginForm.get(field)?.setErrors({
                  api: err.error[field],
                });
              }
            }
          }
        );

        this.isLoading.next(false);
      }, 300);
    }
  }

  getErrorsFor(field: string) {
    let controlErrors = this.loginForm.get('password')?.errors;
    if (controlErrors != null) {
      return Object.keys(controlErrors).map((key) => {
        return {
          key: key,
          value: this.loginForm.get('password')?.getError(key),
        };
      });
    }
    return [];
  }
}
