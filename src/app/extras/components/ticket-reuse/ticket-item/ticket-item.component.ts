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
    this.useLoadMine();
  }
  ngOnInit() {
    this.useInitForm();
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            this.state.you = profile;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateTicket).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveTicket).length > 0;
          })
        )
        .subscribe()
    );
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      id: new FormControl(this.ticket.id),
      note: new FormControl(this.ticket.note),
      status: new FormControl(this.ticket.status),
      ability: new FormControl(this.ticket.ability),
    });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.ticket.customer, isProfile: true } });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.service.remove(this.ticket.id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove ticket successful!', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove ticket fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner(ref);
          })
        ).subscribe()
    );
  }
  useUpdate = (ref: NbDialogRef<any>) => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.service.update(this.state.form.value)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Update ticket fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner(ref);
          })
        ).subscribe()
    );

  }
  useAssign = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.service.update({ id: this.ticket.id, assignee: { id: this.state.you.id } } as any)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Assign ticket successful!', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Assign ticket fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe()
    );
  }
  useShowSpinner = () => {
    this.spinner.show('ticket-edit');
  }
  useHideSpinner = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    this.spinner.hide('ticket-edit');
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
