import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { GlobalService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss']
})
export class ContactItemComponent implements OnInit {
  @Input() customer: CustomerVM;
  @Input() search: string;
  env = 'desktop';
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly deviceService: DeviceDetectorService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: { customer: this.customer } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.customer } });
  }
  usePhone = (phone: string) => {
    if (this.env === 'desktop') {
      this.clipboard.copy(phone);
      this.toastrService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
    } else {
      window.open('tel:' + phone, '_self');
    }
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
}
