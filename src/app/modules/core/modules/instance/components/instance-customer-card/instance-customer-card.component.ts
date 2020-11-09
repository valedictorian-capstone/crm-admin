import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Clipboard } from '@angular/cdk/clipboard';
import { NbToastrService, NbGlobalPhysicalPosition, NbDialogRef, NbDialogService } from '@nebular/theme';
import { EmailService } from '@services';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-instance-customer-card',
  templateUrl: './instance-customer-card.component.html',
  styleUrls: ['./instance-customer-card.component.scss']
})
export class InstanceCustomerCardComponent implements OnInit {
  @Input() customer: CustomerVM;
  env = 'desktop';
  text = '';
  subject = '';
  load = false;
  constructor(
    protected readonly deviceService: DeviceDetectorService,
    protected readonly clipboard: Clipboard,
    protected readonly toastService: NbToastrService,
    protected readonly emailService: EmailService,
    protected readonly dialogService: NbDialogService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
  }

  usePhone = () => {
    if (this.env === 'desktop') {
      this.clipboard.copy(this.customer.phone);
      this.toastService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
    } else {
      window.open('tel:' + this.customer.phone, '_self');
    }
  }
  useSend = (ref: NbDialogRef<any>) => {
    this.load = true;
    this.emailService.sendMail({
      info: this.customer,
      content: this.text,
      subject: this.subject,
    }).pipe(finalize(() => { this.load = false; })).subscribe(
      () => {
        swal.fire('Notification', 'Send mail successfully!!', 'success');
        ref.close();
      },
      () => {
        swal.fire('Notification', 'Send mail fail ! Please try again', 'error');
      }
    );
  }
  useDialog(template: TemplateRef<any>, dialogClass: string) {
    this.dialogService.open(template, { dialogClass });
  }
}
