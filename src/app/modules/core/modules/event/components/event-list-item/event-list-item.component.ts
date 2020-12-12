import { Component, Input, TemplateRef, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { EventService, GlobalService } from '@services';
import { EventVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss']
})
export class EventListItemComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  @Input() event: CalendarEvent & EventVM & { state: string };
  @Input() canUpdate = false;
  @Input() canRemove = false;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly eventService: EventService,
    protected readonly dialogService: NbDialogService,
    protected readonly toastrService: NbToastrService,
  ) { }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'event', payload: { event: this.event } });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    this.subscriptions.push(
      this.eventService.remove(this.event.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Remove event successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Remove event fail! ' + err.message, { duration: 3000 });
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
