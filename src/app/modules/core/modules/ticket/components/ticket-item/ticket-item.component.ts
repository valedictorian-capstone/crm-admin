import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NbToastrService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { GlobalService, TicketService } from '@services';
import { TicketVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit {
  @Input() ticket: TicketVM;
  form: FormGroup;
  config: AngularEditorConfig = {
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
  };
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly ticketService: TicketService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.useInitForm();
  }
  useInitForm = () => {
    this.form = new FormGroup({
      id: new FormControl(this.ticket.id),
      note: new FormControl(this.ticket.note),
      status: new FormControl(this.ticket.status),
      ability: new FormControl(this.ticket.ability),
    });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.ticket.customer, isProfile: true } });
  }
  useResolve = () => {
    this.ticketService.update({ ...this.ticket, status: 'resolve' } as any).subscribe((data) => {
      this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
    }, (err) => {
      this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
    });
  }
  useRemove = () => {
    this.ticketService.remove(this.ticket.id).subscribe((data) => {
      this.toastrService.success('', 'Remove ticket successful!', { duration: 3000 });
    }, (err) => {
      this.toastrService.success('', 'Remove ticket successful!', { duration: 3000 });
    });
  }
  useUpdate = (ref: NbDialogRef<any>) => {
    this.useShowSpinner();
    this.ticketService.update(this.form.value)
      .pipe(
        finalize(() => {
          this.useHideSpinner(ref);
        })
      )
      .subscribe((data) => {
      this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
    }, (err) => {
      this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
    });
  }
  useShowSpinner = () => {
    this.spinner.show('ticket-edit');
  }
  useHideSpinner = (ref: NbDialogRef<any>) => {
    this.spinner.hide('ticket-edit');
    ref.close();
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
}
