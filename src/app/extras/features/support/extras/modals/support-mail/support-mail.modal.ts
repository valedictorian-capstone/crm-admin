import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbToastrService } from '@nebular/theme';
import { EmailService } from '@services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { finalize, tap, catchError } from 'rxjs/operators';
interface ISupportMailPageState {
  form: FormGroup;
  config: AngularEditorConfig;
}
interface ISupportMailPagePayload{
  email: string;
}
@Component({
  selector: 'app-support-mail',
  templateUrl: './support-mail.modal.html',
  styleUrls: ['./support-mail.modal.scss']
})
export class SupportMailModal implements OnInit, OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() payload: ISupportMailPagePayload;
  subscriptions: Subscription[] = [];
  state: ISupportMailPageState = {
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
    protected readonly service: EmailService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
  ) {
    this.useInitForm();
  }

  ngOnInit() {
    if (this.payload.email) {
      this.state.form.get('email').setValue(this.payload.email);
    }
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      email: new FormControl(['', [Validators.required, Validators.email]]),
      subject: new FormControl(['']),
      content: new FormControl(['']),
    });
  }
  useSend = () => {
    this.useShowSpinner();
    const subscription = this.service.sendMail({
      info: { email: this.state.form.value.email } as any,
      content: this.state.form.value.content,
      subject: this.state.form.value.subject,
    }).pipe(
      tap((data) => {
        this.useClose.emit();
        this.toastrService.success('', 'Send mail successful!', { duration: 3000 });
      }),
      catchError((err) => {
        this.toastrService.danger('', 'Send mail fail! ' + err.error.message, { duration: 3000 });
        return of(undefined);
      }),
      finalize(() => { this.useHideSpinner(); })
    ).subscribe();
    this.subscriptions.push(subscription);
  }
  useShowSpinner = () => {
    this.spinner.show('mail-sender');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('mail-sender');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
