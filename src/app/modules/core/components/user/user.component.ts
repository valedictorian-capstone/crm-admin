import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GlobalService } from '@services';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  fullname = JSON.parse(localStorage.getItem('fullname'));
  avatar = localStorage.getItem('avatar') ? JSON.parse(localStorage.getItem('avatar')) : undefined;
  canSetting = false;
  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly deviceService: DeviceDetectorService,
  ) {
    activatedRoute.data.subscribe((data) => console.log(data));
  }

  ngOnInit() {
    this.useTrigger();
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .subscribe((data) => {
        console.log(data);
        this.fullname = data.fullname;
        this.avatar = data.avatar;
        localStorage.setItem('fullname', JSON.stringify(data.fullname));
        localStorage.setItem('avatar', JSON.stringify(data.avatar));
        if (Math.min(...data.roles.map((e) => e.level)) <= 0) {
          this.canSetting = true;
        }
      });
  }
  useTrigger = () => {
    this.authService.triggerValue$.subscribe((data) => {
      this.fullname = data.fullname;
      this.avatar = data.avatar;
      localStorage.setItem('fullname', JSON.stringify(data.fullname));
      localStorage.setItem('avatar', JSON.stringify(data.avatar));
    });
  }
  useOut = () => {
    localStorage.clear();
    this.router.navigate(['auth']);
  }
  useProfile = () => {
    this.globalService.triggerView$.next({ type: 'setting-profile', payload: {} });
  }
  usePassword = () => {
    this.globalService.triggerView$.next({ type: 'setting-password', payload: {} });
  }
  useSetting = () => {
    this.globalService.triggerView$.next({ type: 'setting-permission', payload: {} });
  }
}
