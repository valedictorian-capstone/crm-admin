import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AccountService, AuthService, GlobalService, RoleService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-setting-permission',
  templateUrl: './setting-permission.page.html',
  styleUrls: ['./setting-permission.page.scss']
})
export class SettingPermissionPage implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  roles: RoleVM[] = [];
  selectedRole: RoleVM;
  accounts: AccountVM[] = [];
  search = '';
  you: AccountVM;
  level = 99999;
  constructor(
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly roleService: RoleService,
    protected readonly employeeService: AccountService,
    protected readonly authService: AuthService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly deviceService: DeviceDetectorService,
  ) { }

  ngOnInit() {
    this.useReLoad();
    this.useSocket();
  }
  useReLoad = () => {
    this.useShowSpinner();
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .pipe(
        tap((data) => {
          this.you = data;
          this.level = Math.min(...data.roles.map((e) => e.level));
        }),
        switchMap(() => this.employeeService.findAll()),
        tap((data) => this.accounts = data),
        switchMap(() => this.roleService.findAll()),
        finalize(() => {
          this.useHideSpinner();
        }),
      )
      .subscribe((data) => {
        this.roles = data.filter((e) => e.level > this.level).sort((a, b) => a.level - b.level).map((role) => ({
          ...role,
          accounts: role.accounts
        }));
      });
  }
  useSocket = () => {
    this.roleService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.roles.push((trigger.data as RoleVM));
      } else if (trigger.type === 'update') {
        this.roles[this.roles.findIndex((e) => e.id === (trigger.data as RoleVM).id)] = (trigger.data as RoleVM);
      } else if (trigger.type === 'remove') {
        this.roles.splice(this.roles.findIndex((e) => e.id === (trigger.data as RoleVM).id), 1);
      }
    });
    this.employeeService.triggerSocket().subscribe((trigger) => {
      if (this.selectedRole && (trigger.data as AccountVM).roles.find((role) => role.id === this.selectedRole.id)) {
        if (trigger.type === 'create') {
          this.selectedRole.accounts.push((trigger.data as AccountVM));
        } else if (trigger.type === 'update') {
          this.selectedRole.accounts[this.selectedRole.accounts.findIndex((e) => e.id === (trigger.data as AccountVM).id)] =
            (trigger.data as AccountVM);
        } else if (trigger.type === 'remove') {
          this.selectedRole.accounts.splice(this.selectedRole.accounts.findIndex((e) => e.id === (trigger.data as AccountVM).id), 1);
        }
      }
    });
  }
  useShowSpinner = () => {
    this.spinner.show('setting-permission');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('setting-permission');
    }, 1000);
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'role', payload: {} });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'role', payload: { role: this.selectedRole } });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'employee' } });
  }
}
