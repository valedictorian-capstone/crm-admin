import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NotificationService, GlobalService } from '@services';
import { AccountVM, NotificationVM } from '@view-models';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, finalize } from 'rxjs/operators';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @ViewChild('template', { static: false }) template: TemplateRef<{}>;
  @Input() you: AccountVM;
  showNotification = false;
  new = false;
  badge = 0;
  notifications: NotificationVM[] = [];
  constructor(
    protected readonly notificationService: NotificationService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly notificationZoro: NzNotificationService
  ) { }

  ngOnInit() {
    this.useReload();
    this.useSocket();
  }
  useReload = () => {
    this.useShowSpinner();
    this.notificationService
      .findAll()
      .pipe(
        tap((data) => this.notifications = data),
        finalize(() => {
          this.useSetBadge();
          this.useHideSpinner();
        })
      ).subscribe();
  }
  useSocket = () => {
    this.notificationService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create' && (trigger.data as NotificationVM).account.id === this.you.id) {
        if (!this.showNotification) {
          this.new = true;
        }
        this.notifications.push(trigger.data as NotificationVM);
        this.notificationZoro.template(this.template, {
          nzData: trigger.data as NotificationVM, nzPlacement: 'bottomLeft'
          , nzCloseIcon: ''
        });
        if (!this.showNotification) {
          setTimeout(() => {
            this.new = false;
          }, 10000);
        }
      } else if (trigger.type === 'update') {
        this.notifications[this.notifications.findIndex((e) => e.id === (trigger.data as NotificationVM).id)] =
          (trigger.data as NotificationVM);
      } else if (trigger.type === 'list') {
        (trigger.data as NotificationVM[]).forEach((notification) => {
          this.notifications[this.notifications.findIndex((e) => e.id === notification.id)] =
            notification;
        });
      }
      this.useSetBadge();
    });
  }
  useSetBadge = () => {
    this.badge = this.notifications.filter((notification) => !notification.isSeen).length;
  }
  useToggleNotification = () => {
    this.showNotification = !this.showNotification;
    this.new = false;
  }
  useHideNotification = (event: any, ref: HTMLElement) => {
    if (!ref.contains(event.target)) {
      this.showNotification = false;
    }
  }
  useSeenAll = () => {
    const notSeens = this.notifications.filter((notification) => !notification.isSeen);
    notSeens.forEach((notification) => {
      this.notifications[this.notifications.findIndex((e) => e.id === notification.id)].isSeen = true;
    });
    this.notificationService.seenAll(notSeens).subscribe();
    this.useSetBadge();
  }
  useSelect = (notification: NotificationVM) => {
    this.notifications[this.notifications.findIndex((e) => e.id === notification.id)].isSeen = true;
    this.notificationService.seen(notification.id).subscribe();
    this.globalService.triggerView$.next({ type: notification.name, payload: { [notification.name]: notification.data } });
    this.showNotification = false;
    this.useSetBadge();
  }
  useShowSpinner = () => {
    this.spinner.show('notifications');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('notifications');
    }, 1000);
  }
}
