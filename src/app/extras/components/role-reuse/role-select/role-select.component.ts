import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService, RoleService } from '@services';
import { RoleVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.scss']
})
export class RoleSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Input() template: HTMLElement;
  @Input() selected: RoleVM;
  roles: RoleVM[] = [];
  value = '';
  stage = 'done';
  level = 9999;
  constructor(
    protected readonly roleService: RoleService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .pipe(
        tap((data) => {
          this.level = Math.min(...data.roles.map((e) => e.level));
        }),
        switchMap(() => this.roleService.findAll()),
        finalize(() => {
          setTimeout(() => {
            this.stage = 'done';
          }, 500);
        })
      )
      .subscribe((data) => {
        console.log(this.level);
        this.roles = data.filter((e) => e.level > this.level);
      });
  }
}
