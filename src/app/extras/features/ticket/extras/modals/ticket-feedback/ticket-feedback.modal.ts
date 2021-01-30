import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TicketService } from '@services';
import { State } from '@store/states';
import { TicketVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface ITicketSavePageState {
  form: FormGroup;
}

interface ITicketSavePagePayload {
  ticket: TicketVM;
}

@Component({
  selector: 'app-ticket-feedback',
  templateUrl: './ticket-feedback.modal.html',
  styleUrls: ['./ticket-feedback.modal.scss']
})
export class TicketFeedbackModal implements OnInit, OnDestroy {
  @Input() payload: ITicketSavePagePayload = {
    ticket: undefined,
  };
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<TicketVM> = new EventEmitter<TicketVM>();
  subscriptions: Subscription[] = [];
  state: ITicketSavePageState = {
    form: undefined,
  }
  constructor(
    protected readonly service: TicketService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useInitForm();
  }
  ngOnInit() {
    this.state.form.patchValue(this.payload.ticket);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = this.service.update({
        id: this.payload.ticket.id,
        ...this.state.form.value,
        feedbackStatus: 'resolve',
      })
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save ticket successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save ticket fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe();
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      feedbackMessage: new FormControl(''),
      feedbackRating: new FormControl(1),
      feedbackAssigneeRating: new FormControl(1),
    });
  }
  useShowSpinner = () => {
    this.spinner.show('ticket-feedback');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('ticket-feedback');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
