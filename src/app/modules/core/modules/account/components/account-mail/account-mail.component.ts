import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailService } from '@services';
import { CustomerVM } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account-mail',
  templateUrl: './account-mail.component.html',
  styleUrls: ['./account-mail.component.scss']
})
export class AccountMailComponent implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() account: CustomerVM;
  text = '';
  subject = '';
  load = false;
  constructor(
    protected readonly emailService: EmailService,
  ) { }

  ngOnInit() {
  }

  useSend = () => {
    this.load = true;
    this.emailService.sendMail({
      info: this.account,
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
