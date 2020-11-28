import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-reuse-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss']
})
export class EmployeeItemComponent implements OnInit {
  @Input() you: AccountVM;
  @Input() employee: AccountVM;
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
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee, isProfile: true } });
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
