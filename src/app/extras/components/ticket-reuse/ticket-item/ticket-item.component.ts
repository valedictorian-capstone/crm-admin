import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { GlobalService, TicketService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, TicketVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
interface ITicketItemComponentState {
  you: AccountVM;
  canUpdate: boolean;
  canGetFeedback: boolean;
  canAssign: boolean;
  canRemove: boolean;
  form: FormGroup;
  config: AngularEditorConfig;
}
@Component({
  selector: 'app-reuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, OnDestroy {
  @Input() ticket: TicketVM;
  subscriptions: Subscription[] = [];
  state: ITicketItemComponentState = {
    you: undefined,
    canUpdate: false,
    canRemove: false,
    canAssign: false,
    canGetFeedback: false,
    form: undefined,
    config: {
      editable: true,
      spellcheck: true,
      height: '10rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [
        ['bold']
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ]
    }
  }
  constructor(
    protected readonly service: TicketService,
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
    protected readonly store: Store<State>
  ) {
  }
  ngOnInit() {
    this.useLoadMine();
    this.useInitForm();
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignTicket).length > 0;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateTicket).length > 0 && (this.ticket.assignee ? (this.ticket.assignee.id === this.state.you.id) : true);
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveTicket).length > 0 && this.ticket.assignee?.id === this.state.you.id;
            this.state.canGetFeedback = this.state.you.roles.filter((role) => role.canGetFeedbackTicket).length > 0 && (this.ticket.assignee ? this.ticket.assignee.id !== this.state.you.id : false);
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      id: new FormControl(this.ticket.id),
      note: new FormControl(this.ticket.note),
      status: new FormControl(this.ticket.status),
      ability: new FormControl(this.ticket.ability),
      feedbackMessage: new FormControl(this.ticket.feedbackMessage),
      feedbackRating: new FormControl(this.ticket.feedbackRating),
      feedbackStatus: new FormControl(this.ticket.feedbackStatus),
    });
  }
  useView = () => {
    if (this.ticket.customer) {
      this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.ticket.customer, isProfile: true } });
    }
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner('item-' + this.ticket.id);
    const subscription = this.service.remove(this.ticket.id)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Remove ticket successful!', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Remove ticket fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner('item-' + this.ticket.id);
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useUpdate = (ref: NbDialogRef<any>) => {
    this.useShowSpinner('edit');
    const subscription = this.service.update(this.state.form.value)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Update ticket fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner('edit', ref);
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useAssign = () => {
    this.useShowSpinner('item-' + this.ticket.id);
    const subscription = this.service.update({ id: this.ticket.id, assignee: { id: this.state.you.id } } as any)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Assign ticket successful!', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Assign ticket fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner('item-' + this.ticket.id);
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useAssignFeedback = () => {
    this.useShowSpinner('item-' + this.ticket.id);
    const subscription = this.service.update({ id: this.ticket.id, feedbackAssignee: { id: this.state.you.id } } as any)
      .pipe(
        tap((data) => {
          this.toastrService.success('', 'Assign to feedback ticket successful!', { duration: 3000 });
        }),
        catchError((err) => {
          this.toastrService.danger('', 'Assign to feedback ticket fail! ' + err.message, { duration: 3000 });
          return of(undefined);
        }),
        finalize(() => {
          this.useHideSpinner('item-' + this.ticket.id);
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useShowSpinner = (type: string) => {
    this.spinner.show('ticket-' + type);
  }
  useHideSpinner = (type: string, ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    this.spinner.hide('ticket-' + type);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
