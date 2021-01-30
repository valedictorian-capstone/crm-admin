import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITicketMainState } from '@extras/features/ticket';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { TicketService } from '@services';
import { TicketVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.area.html',
  styleUrls: ['./ticket-card.area.scss']
})
export class TicketCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, ticket: TicketVM}[]> = new EventEmitter<{formControl: FormControl, ticket: TicketVM}[]>();
  checkList: {formControl: FormControl, ticket: TicketVM}[] = [];
  @Input() state: ITicketMainState;
  @Input() sort: ISort;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: TicketService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.checkList = this.state.paginationArray.map((ticket) => ({
      ticket,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck() {
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an ticket?',
      text: 'When you click OK button, an ticket will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove ticket successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove ticket fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  useAssign(id: string) {
    this.service.update({ id: id, assignee: { id: this.state.you.id } } as any)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Assign ticket successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Assign ticket fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        })
      )
      .subscribe();
  }
  useAssignFeedback(id: string) {
    this.service.update({ id: id, feedbackAssignee: { id: this.state.you.id } } as any)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Assign ticket successful', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Assign ticket fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        })
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
