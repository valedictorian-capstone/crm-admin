import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { TicketService, GlobalService } from '@services';
import { TicketVM, AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-card-item',
  templateUrl: './ticket-card-item.component.html',
  styleUrls: ['./ticket-card-item.component.scss']
})
export class TicketCardItemComponent {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Output() useAssign: EventEmitter<any> = new EventEmitter<any>();
  @Output() useAssignFeedback: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() ticket: TicketVM;
  @Input() you: AccountVM;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  canRemove = false;
  canUpdate = false;
  canGetAll = false;
  canGetDeal = false;
  canGetSupport = false;
  canGetFeedback = false;
  show = true;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: TicketService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  ngOnInit() {
    this.canGetAll = this.you.roles.filter((role) => role.canGetAllTicket).length > 0;
    this.canGetDeal = this.you.roles.filter((role) => role.canGetDealTicket).length > 0;
    this.canGetSupport = this.you.roles.filter((role) => role.canGetSupportTicket).length > 0;
    this.canGetFeedback = this.you.roles.filter((role) => role.canGetFeedbackTicket).length > 0;
    this.canUpdate = this.you.roles.filter((role) => role.canUpdateTicket).length > 0;
    this.canRemove = this.you.roles.filter((role) => role.canRemoveTicket).length > 0;
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'ticket', payload: { ticket: this.ticket } });
  }
  useFeedback() {
    this.globalService.triggerView$.next({ type: 'ticket-feedback', payload: { ticket: this.ticket } });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
