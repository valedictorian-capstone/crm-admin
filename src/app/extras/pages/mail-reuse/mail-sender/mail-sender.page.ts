import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NbToastrService } from '@nebular/theme';
import { EmailService } from '@services';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-mail-sender',
  templateUrl: './mail-sender.page.html',
  styleUrls: ['./mail-sender.page.scss']
})
export class MailSenderPage implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() email: string;
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
  form = new FormGroup({
    email: new FormControl(['', [Validators.required, Validators.email]]),
    subject: new FormControl(['']),
    content: new FormControl(['']),
  });
  constructor(
    protected readonly spinner: NgxSpinnerService,
    protected readonly emailService: EmailService,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    if (this.email) {
      this.form.get('email').setValue(this.email);
    }
  }

  useSend = () => {
    this.useShowSpinner();
    this.emailService.sendMail({
      info: { email: this.form.value.email } as any,
      content: this.form.value.content,
      subject: this.form.value.subject,
    }).pipe(finalize(() => { this.useHideSpinner(); })).subscribe(
      () => {
        this.useClose.emit();
        this.toastrService.success('', 'Send mail success!', { duration: 3000 });
      },
      () => {
        this.toastrService.danger('', 'Send mail fail! Something wrong at runtime', { duration: 3000 });
      }
    );
  }
  useShowSpinner = () => {
    this.spinner.show('mail-sender');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('mail-sender');
    }, 1000);
  }
}
