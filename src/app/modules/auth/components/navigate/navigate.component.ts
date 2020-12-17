import {
  AuthAction,
  NotificationAction
} from '@actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService, TokenService } from '@services';
import { State } from '@states';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, Subscription } from 'rxjs';
import { catchError, pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  device;
  url: string;
  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    protected readonly authService: AuthService,
    protected readonly tokenService: TokenService,
    protected readonly angularFireMessaging: AngularFireMessaging,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly store: Store<State>
  ) {
    const subscription = this.activatedRoute.queryParams.pipe(
      pluck('returnUrl'),
      tap((url) => {
        this.url = url;
      })
    ).subscribe();
    this.subscriptions.push(subscription);
  }

  ngOnInit() {
    this.useCheckNotification();
  }
  useCheckNotification = async () => {
    console.log(typeof Notification);
    if (typeof Notification !== 'undefined') {
      try {
        await Notification.requestPermission().then(async (permission) => {
          console.log('noti-oke');
          if (permission !== 'granted') {
            this.useRouting(undefined);
          } else {
            const fcmToken = await this.angularFireMessaging.getToken.toPromise();
            localStorage.setItem('fcmToken', fcmToken);
            this.useRouting(fcmToken);
          }
        });
      } catch (error) {
        console.log('noti-error', error);
        this.useRouting(undefined);
      }
    } else {
      this.useRouting(undefined);
    }

  }
  useRouting = (fcmToken: string) => {
    const device = fcmToken ? { id: fcmToken, ...this.deviceService.getDeviceInfo() } as any : undefined;
    const subscription = this.authService.auth(device)
      .pipe(
        tap((res) => {
          this.store.dispatch(AuthAction.FetchSuccessAction(res));
          // this.store.dispatch(DeviceAction.FindAllAction({}));
          this.store.dispatch(NotificationAction.FindAllAction({}));
          this.router.navigate([this.url ? this.url : 'core']);
        }),
        catchError((err) => {
          this.tokenService.clearToken();
          this.router.navigate(['auth/login'], {
            queryParams: this.url ? { returnUrl: this.url } : undefined
          });
          return of(undefined);
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
