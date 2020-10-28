import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { CustomerVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lead-mail',
  templateUrl: './lead-mail.component.html',
  styleUrls: ['./lead-mail.component.scss']
})
export class LeadMailComponent implements OnInit {
  @Input() lead: CustomerVM;
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
      info: this.lead,
      content: this.text,
      subject: this.subject,
    }).subscribe(
      () => {
        swal.fire('Notification', 'Send mail successfully!!', 'success');
        ref.close();
      },
      (err) => {
        swal.fire('Notification', 'Send mail fail ! Please try again', 'error');
      }
    );
  }
}
