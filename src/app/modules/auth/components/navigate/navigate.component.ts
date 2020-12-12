import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, TokenService } from '@services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { pluck, tap, catchError } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@states';
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
    this.subscriptions.push(
      this.activatedRoute.queryParams.pipe(
        pluck('returnUrl'),
        tap((url) => {
          this.url = url;
        })
      ).subscribe()
    );
  }

  async ngOnInit() {
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
    this.authService.auth(device)
      .pipe(
        tap((res) => {
          this.store.dispatch(AuthAction.FetchSuccessAction(res));
          // this.store.dispatch(DeviceAction.FindAllAction({}));
          this.store.dispatch(NotificationAction.FindAllAction({}));
          setTimeout(() => {
            // if (res.roles.filter((role) => role.canAccessRole).length > 0) {
            //   this.store.dispatch(RoleAction.FindAllAction({}));
            //   this.store.dispatch(AccountAction.FindAllAction({}));
            // }
            // if (res.roles.filter((role) => role.canAccessProduct).length > 0) {
            //   this.store.dispatch(ProductAction.FindAllAction({}));
            //   this.store.dispatch(CategoryAction.FindAllAction({}));
            //   this.store.dispatch(CommentAction.FindAllAction({}));
            //   this.store.dispatch(GroupAction.FindAllAction({}));
            // }
            // if (res.roles.filter((role) => role.canAccessDeal).length > 0) {
            //   this.store.dispatch(PipelineAction.FindAllAction({}));
            //   this.store.dispatch(StageAction.FindAllAction({}));
            //   this.store.dispatch(DealAction.FindAllAction({}));
            //   this.store.dispatch(CustomerAction.FindAllAction({}));
            //   this.store.dispatch(ActivityAction.FindAllAction({}));
            //   this.store.dispatch(AttachmentAction.FindAllAction({}));
            //   this.store.dispatch(DealDetailAction.FindAllAction({}));
            //   this.store.dispatch(NoteAction.FindAllAction({}));
            //   this.subscriptions.push(
            //     this.store.select((state) => state.product.firstLoad).pipe(
            //       tap((firstLoad) => {
            //         if (!firstLoad) {
            //           this.store.dispatch(ProductAction.FindAllAction({}));
            //         }
            //       })
            //     ).subscribe()
            //   );
            //   if (res.roles.filter((role) => role.canAssignDeal).length > 0 || res.roles.filter((role) => role.canAssignActivity).length > 0) {
            //     this.subscriptions.push(
            //       this.store.select((state) => state.account.firstLoad).pipe(
            //         tap((firstLoad) => {
            //           if (!firstLoad) {
            //             this.store.dispatch(ProductAction.FindAllAction({}));
            //           }
            //         })
            //       ).subscribe()
            //     );
            //   }
            // }
            // if (res.roles.filter((role) => role.canAccessCustomer).length > 0) {
            //   this.store.dispatch(GroupAction.FindAllAction({}));
            //   this.subscriptions.push(
            //     this.store.select((state) => state.customer.firstLoad).pipe(
            //       tap((firstLoad) => {
            //         if (!firstLoad) {
            //           this.store.dispatch(CustomerAction.FindAllAction({}));
            //         }
            //       })
            //     ).subscribe()
            //   );
            // }
            // if (res.roles.filter((role) => role.canAccessTicket).length > 0) {
            //   this.store.dispatch(TicketAction.FindAllAction({}));
            //   this.subscriptions.push(
            //     this.store.select((state) => state.customer.firstLoad).pipe(
            //       tap((firstLoad) => {
            //         if (!firstLoad) {
            //           this.store.dispatch(CustomerAction.FindAllAction({}));
            //         }
            //       })
            //     ).subscribe()
            //   );
            //   if (res.roles.filter((role) => role.canAssignCustomer).length > 0) {
            //     this.subscriptions.push(
            //       this.store.select((state) => state.account.firstLoad).pipe(
            //         tap((firstLoad) => {
            //           if (!firstLoad) {
            //             this.store.dispatch(AccountAction.FindAllAction({}));
            //           }
            //         })
            //       ).subscribe()
            //     );
            //   }
            // }
            // if (res.roles.filter((role) => role.canAccessEvent).length > 0) {
            //   this.store.dispatch(EventAction.FindAllAction({}));
            //   this.subscriptions.push(
            //     this.store.select((state) => state.group.firstLoad).pipe(
            //       tap((firstLoad) => {
            //         if (!firstLoad) {
            //           this.store.dispatch(GroupAction.FindAllAction({}));
            //         }
            //       })
            //     ).subscribe()
            //   );
            // }
            this.router.navigate([this.url ? this.url : 'core']);
          }, 1000);
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
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
