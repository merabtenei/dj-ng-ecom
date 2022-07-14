import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errorMessage?: string = undefined;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let password = group.get('password')?.value;
    let confirmPassword = group.get('password2')?.value;
    if (password === confirmPassword) return null;
    else {
      group.get('password2')?.setErrors({ notSamePassword: true });
      return { notSamePassword: true };
    }
  };

  form = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    },
    this.checkPasswords
  );

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isLoading.next(true);
      this.errorMessage = '';

      setTimeout(() => {
        let username = this.form.get('username')?.value;
        let email = this.form.get('email')?.value;
        let password = this.form.get('password')?.value;

        this.auth.register(
          username,
          email,
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
                this.form.get(field)?.setErrors({
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
    let controlErrors = this.form.get('password')?.errors;
    if (controlErrors != null) {
      return Object.keys(controlErrors).map((key) => {
        return {
          key: key,
          value: this.form.get('password')?.getError(key),
        };
      });
    }
    return [];
  }
}
