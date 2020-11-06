import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailService } from '@services';
import { CustomerVM } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-opportunity-mail',
  templateUrl: './opportunity-mail.component.html',
  styleUrls: ['./opportunity-mail.component.scss']
})
export class OpportunityMailComponent implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() opportunity: CustomerVM;
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
      info: this.opportunity,
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
