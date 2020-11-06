import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { AccountVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-employee-mail',
  templateUrl: './employee-mail.component.html',
  styleUrls: ['./employee-mail.component.scss']
})
export class EmployeeMailComponent implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() employee: AccountVM;
  text = '';
  subject = '';
  load = false;
  constructor(
    protected readonly dialogService: NbDialogService,
    protected readonly emailService: EmailService,
  ) { }

  ngOnInit() {
  }

  useSend = () => {
    this.load = true;
    this.emailService.sendMail({
      info: this.employee as any,
      content: this.text,
      subject: this.subject,
    }).pipe(finalize(() => { this.load = false; })).subscribe(
      () => {
        swal.fire('Notification', 'Send mail successfully!!', 'success');
        this.useClose.emit();
      },
      () => {
        swal.fire('Notification', 'Send mail fail ! Please try again', 'error');
      }
    );
  }
}
