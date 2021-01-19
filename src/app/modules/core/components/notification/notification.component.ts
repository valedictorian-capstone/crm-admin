import { Component, Input, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationService, GlobalService } from '@services';
import { State } from '@store/states';
import { AccountVM, NotificationVM } from '@view-models';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { authSelector } from '@store/selectors';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @ViewChild('template', { static: false }) template: TemplateRef<{}>;
  subscriptions: Subscription[] = [];
  state: { you: AccountVM, show: boolean, new: boolean, badge: number, array: NotificationVM[] } = {
    you: undefined,
    show: false,
    new: false,
    badge: 0,
    array: [],
  }
  constructor(
    protected readonly service: NotificationService,
    protected readonly router: Router,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly notificationService: NzNotificationService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useReload();
    this.useSocket();
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
            }
          })
        )
        .subscribe()
    );
  }
  useReload = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.service
        .findAll()
        .pipe(
          tap((data) => this.state.array = data.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1)),
          finalize(() => {
            this.useSetBadge();
            this.useHideSpinner();
          })
        ).subscribe()
    );
  }
  useSocket = () => {
    this.subscriptions.push(
      this.service.triggerSocket()
        .pipe(
          tap((trigger) => {
            if (trigger.type === 'create' && (trigger.data as NotificationVM).employee.id === this.state.you.id) {
              if (!this.state.show) {
                this.state.new = true;
              }
              this.state.array.push(trigger.data as NotificationVM);
              this.notificationService.template(this.template, {
                nzData: trigger.data as NotificationVM, nzPlacement: 'bottomLeft'
                , nzCloseIcon: ''
              });
              if (!this.state.show) {
                setTimeout(() => {
                  this.state.new = false;
                }, 10000);
              }
            } else if (trigger.type === 'update') {
              this.state.array[this.state.array.findIndex((e) => e.id === (trigger.data as NotificationVM).id)] =
                (trigger.data as NotificationVM);
            } else if (trigger.type === 'list') {
              (trigger.data as NotificationVM[]).forEach((notification) => {
                this.state.array[this.state.array.findIndex((e) => e.id === notification.id)] =
                  notification;
              });
            }
            this.state.array = this.state.array.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1);
            this.useSetBadge();
          })
        )
        .subscribe()
    );
  }
  useSetBadge = () => {
    this.state.badge = this.state.array.filter((notification) => !notification.isSeen).length;
  }
  useToggleNotification = () => {
    this.state.show = !this.state.show;
    this.state.new = false;
  }
  useHideNotification = (event: any, ref: HTMLElement) => {
    if (!ref.contains(event.target)) {
      this.state.show = false;
    }
  }
  useSeenAll = () => {
    const notSeens = this.state.array.filter((notification) => !notification.isSeen);
    notSeens.forEach((notification) => {
      this.state.array[this.state.array.findIndex((e) => e.id === notification.id)].isSeen = true;
    });
    this.subscriptions.push(this.service.seenAll(notSeens).subscribe());
    this.useSetBadge();
  }
  useSelect = (notification: NotificationVM) => {
    this.state.array[this.state.array.findIndex((e) => e.id === notification.id)] = { ...this.state.array[this.state.array.findIndex((e) => e.id === notification.id)], isSeen: true };
    this.subscriptions.push(this.service.seen(notification.id).subscribe());
    this.router.navigate(['core/' + notification.name]);
    this.state.show = false;
    this.useSetBadge();
  }
  useShowSpinner = () => {
    this.spinner.show('state.array');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('state.array');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
