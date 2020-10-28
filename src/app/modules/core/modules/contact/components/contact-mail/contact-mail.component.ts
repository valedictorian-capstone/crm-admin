import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { CustomerVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-contact-mail',
  templateUrl: './contact-mail.component.html',
  styleUrls: ['./contact-mail.component.scss']
})
export class ContactMailComponent implements OnInit {
  @Input() contact: CustomerVM;
  text = '';
  subject = '';
  constructor(
    protected readonly dialogService: NbDialogService,
    protected readonly emailService: EmailService,
  ) { }

  ngOnInit() {
  }

  open(dialog: TemplateRef<any>) {
    this.text = '';
    this.subject = '';
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  send = (ref: NbDialogRef<any>) => {
    this.emailService.sendMail({
      info: this.contact,
      content: this.text,
      subject: this.subject,
    }).subscribe(
      () => {
        swal.fire('Notification', 'Send mail successfully!!', 'success');
        ref.close();
      },
      () => {
        swal.fire('Notification', 'Send mail fail ! Please try again', 'error');
      }
    );
  }
}
