import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { ActivityService, GlobalService } from '@services';
import { State } from '@store/states';
import { ActivityVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-activity-list-item',
  templateUrl: './activity-list-item.component.html',
  styleUrls: ['./activity-list-item.component.scss']
})
export class ActivityListItemComponent implements OnDestroy {
  @Input() event: CalendarEvent & ActivityVM & { state: string };
  @Input() canUpdate = false;
  @Input() canAssign = false;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly activityService: ActivityService,
    protected readonly dialogService: NbDialogService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>,
  ) { }

  useIcon = (type: string) => {
    switch (type) {
      case 'email':
        return {
          icon: 'email-outline',
          pack: 'eva'
        };
      case 'call':
        return {
          icon: 'phone-outline',
          pack: 'eva'
        };
      case 'task':
        return {
          icon: 'clock-outline',
          pack: 'eva'
        };
      case 'deadline':
        return {
          icon: 'flag-outline',
          pack: 'eva'
        };
      case 'meetting':
        return {
          icon: 'people-outline',
          pack: 'eva'
        };
      case 'lunch':
        return {
          icon: 'utensils',
          pack: 'font-awesome'
        };
    }
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: this.event } });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    const subscription = this.activityService.remove(this.event.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Remove activity successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Remove activity fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useShowSpinner = () => {
    this.spinner.show('activity-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('activity-main');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
