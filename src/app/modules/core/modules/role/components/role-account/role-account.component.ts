import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthService, GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-role-account',
  templateUrl: './role-account.component.html',
  styleUrls: ['./role-account.component.scss']
})
export class RoleAccountComponent implements OnInit {
  @Output() useToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() employee: AccountVM & { selected?: boolean };
  @Input() level: number;
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
    protected readonly spinner: NgxSpinnerService,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
  }

  ngOnInit() {
    this.useShowSpinner();
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
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
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useShowSpinner = () => {
    this.spinner.show('role-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-main');
    }, 1000);
  }
}
