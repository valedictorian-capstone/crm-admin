import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, TokenService } from '@services';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  load = false;
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder,
    protected readonly authService: AuthService,
    protected readonly tokenService: TokenService,
  ) {
    this.form = this.fb.group({
      emailOrPhone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }
  getStatus = (name: 'emailOrPhone' | 'password'): 'danger' | 'success' | 'default' => {
    const control = this.form.get(name);
    return (control.touched || control.dirty) ? (control.invalid ? 'danger' : 'success') : 'default';
  }
  useSubmit = async () => {
    if (this.form.valid) {
      this.load = true;
      this.authService.login(this.form.value)
        .pipe(
          finalize(() => {
            this.load = false;
          })
        )
        .subscribe(
          (data) => {
            this.tokenService.setToken(data);
            this.router.navigate(['auth']);
          },
          (err) => {
            swal.fire('Login Failed', 'Email or Phone or Password is wrong! Please try again', 'error');
          }
        );
    } else {
      this.form.get('emailOrPhone').markAsTouched();
      this.form.get('password').markAsTouched();
    }
  }
  useEnter = (event) => {
    if (event.key === 'Enter') {
      this.useSubmit();
    }
  }
}
