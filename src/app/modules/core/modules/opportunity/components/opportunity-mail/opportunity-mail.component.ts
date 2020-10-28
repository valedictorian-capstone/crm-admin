import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { CustomerVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-opportunity-mail',
  templateUrl: './opportunity-mail.component.html',
  styleUrls: ['./opportunity-mail.component.scss']
})
export class OpportunityMailComponent implements OnInit {
  @Input() opportunity: CustomerVM;
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
      info: this.opportunity,
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
