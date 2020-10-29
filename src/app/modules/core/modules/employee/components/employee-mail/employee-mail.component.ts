import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { AccountVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-employee-mail',
  templateUrl: './employee-mail.component.html',
  styleUrls: ['./employee-mail.component.scss']
})
export class EmployeeMailComponent implements OnInit {
  @Input() employee: AccountVM;
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
      info: this.employee as any,
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
