import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { GlobalService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lead-item',
  templateUrl: './lead-item.component.html',
  styleUrls: ['./lead-item.component.scss']
})
export class LeadItemComponent implements OnDestroy {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Input() customer: CustomerVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() search: string;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly deviceService: DeviceDetectorService,
  ) {
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: { customer: this.customer } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.customer } });
  }
  useDeal = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: { customer: this.customer } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
