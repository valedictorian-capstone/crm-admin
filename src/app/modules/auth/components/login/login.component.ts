import {
  AccountAction, ActivityAction,
  AttachmentAction, AuthAction,
  CategoryAction,
  CommentAction,
  CustomerAction, DealAction,
  DealDetailAction, DeviceAction,
  EventAction,
  GroupAction,
  NoteAction,
  NotificationAction, PipelineAction,
  ProductAction,
  RoleAction, StageAction,
  TicketAction
} from '@actions';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService, TokenService } from '@services';
import { State } from '@store/states';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, pluck, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  form: FormGroup;
  load = false;
  url: string;
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder,
    protected readonly authService: AuthService,
    protected readonly tokenService: TokenService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useReset();
    const subscription = this.activatedRoute.queryParams.pipe(
      pluck('returnUrl'),
      tap((url) => {
        this.url = url;
      })
    ).subscribe();
    this.subscriptions.push(subscription);
    this.form = this.fb.group({
      emailOrPhone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  useReset = () => {
    this.store.dispatch(AuthAction.ResetAction());
    this.store.dispatch(DeviceAction.ResetAction());
  }
  getStatus = (name: 'emailOrPhone' | 'password'): 'danger' | 'success' | 'default' => {
    const control = this.form.get(name);
    return (control.touched || control.dirty) ? (control.invalid ? 'danger' : 'success') : 'default';
  }
  useSubmit = async () => {
    if (this.form.valid) {
      this.load = true;
      const subscription = this.authService.login(this.form.value)
        .pipe(
          tap((data) => {
            this.tokenService.setToken(data);
            this.router.navigate(['auth'], {
              queryParams: this.url ? { returnUrl: this.url } : undefined
            });
          }),
          catchError((err) => {
            swal.fire('Login Failed', 'Email/Phone or Password is wrong! Please try again', 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.load = false;
          })
        )
        .subscribe();
      this.subscriptions.push(subscription);
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
