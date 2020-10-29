import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { CustomerVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-account-mail',
  templateUrl: './account-mail.component.html',
  styleUrls: ['./account-mail.component.scss']
})
export class AccountMailComponent implements OnInit {
  @Input() account: CustomerVM;
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
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  send = (ref: NbDialogRef<any>) => {
    this.emailService.sendMail({
      info: this.account,
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
