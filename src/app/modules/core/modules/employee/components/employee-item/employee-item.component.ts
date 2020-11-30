import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthService, GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss']
})
export class EmployeeItemComponent implements OnInit {
  @Input() employee: AccountVM;
  @Input() search: string;
  env = 'desktop';
  you: AccountVM;
  canEdit = false;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly authService: AuthService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .subscribe((data) => {
        this.you = data;
        if (Math.min(...data.roles.map((e) => e.level)) < Math.min(...this.employee.roles.map((e) => e.level))) {
          this.canEdit = true;
        }
      });
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
