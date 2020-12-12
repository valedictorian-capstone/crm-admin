import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { ActivityService, GlobalService } from '@services';
import { ActivityAction } from '@store/actions';
import { State } from '@store/states';
import { ActivityVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';
import { finalize, tap, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

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
    protected readonly store: Store<State>
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
    this.subscriptions.push(
      this.activityService.remove(this.event.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Remove activity successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Remove activity fail', { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => ref.close())
      ).subscribe()
    );
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
