import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, TokenService } from '@services';
import { Subscription, of } from 'rxjs';
import { finalize, pluck, tap, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import {
  AuthAction,
  DeviceAction,
  DealAction,
  ActivityAction,
  AttachmentAction,
  DealDetailAction,
  PipelineAction,
  StageAction,
  AccountAction,
  CategoryAction,
  CommentAction,
  CustomerAction,
  EventAction,
  GroupAction,
  NoteAction,
  NotificationAction,
  ProductAction,
  RoleAction,
  TicketAction,
} from '@actions';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
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
    this.subscriptions.push(
      this.activatedRoute.queryParams.pipe(
        pluck('returnUrl'),
        tap((url) => {
          this.url = url;
        })
      ).subscribe()
    );
    this.form = this.fb.group({
      emailOrPhone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }
  useReset = () => {
    this.store.dispatch(AuthAction.ResetAction());
    this.store.dispatch(DeviceAction.ResetAction());
    this.store.dispatch(DealAction.ResetAction());
    this.store.dispatch(ActivityAction.ResetAction());
    this.store.dispatch(AttachmentAction.ResetAction());
    this.store.dispatch(DealDetailAction.ResetAction());
    this.store.dispatch(PipelineAction.ResetAction());
    this.store.dispatch(StageAction.ResetAction());
    this.store.dispatch(AccountAction.ResetAction());
    this.store.dispatch(CategoryAction.ResetAction());
    this.store.dispatch(CommentAction.ResetAction());
    this.store.dispatch(CustomerAction.ResetAction());
    this.store.dispatch(EventAction.ResetAction());
    this.store.dispatch(GroupAction.ResetAction());
    this.store.dispatch(NoteAction.ResetAction());
    this.store.dispatch(NotificationAction.ResetAction());
    this.store.dispatch(ProductAction.ResetAction());
    this.store.dispatch(RoleAction.ResetAction());
    this.store.dispatch(TicketAction.ResetAction());
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
