import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DeviceService, GlobalService } from '@services';
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
    protected readonly service: DeviceService,
  ) {
  }

  ngOnInit() {
    this.useSocket();
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .subscribe((data) => {
        this.fullname = data.fullname;
        this.avatar = data.avatar;
        localStorage.setItem('fullname', JSON.stringify(data.fullname));
        localStorage.setItem('avatar', JSON.stringify(data.avatar));
        if (Math.min(...data.roles.map((e) => e.level)) <= 0) {
          this.canSetting = true;
        }
      });
  }
  useSocket = () => {
    this.authService.triggerValue$.subscribe((data) => {
      this.fullname = data.fullname;
      this.avatar = data.avatar;
      localStorage.setItem('fullname', JSON.stringify(data.fullname));
      localStorage.setItem('avatar', JSON.stringify(data.avatar));
    });
  }
  useOut = async () => {
    const fcmToken = localStorage.getItem('fcmToken');
    console.log(fcmToken);
    if (fcmToken) {
      await this.service.remove(fcmToken).toPromise();
    }
    const selectedPipeline = localStorage.getItem('selectedPipeline');
    localStorage.clear();
    if (selectedPipeline) {
      localStorage.setItem('selectedPipeline', selectedPipeline);
    }
    this.router.navigate(['auth']);
  }
  useProfile = () => {
    this.globalService.triggerView$.next({ type: 'setting-profile', payload: {} });
  }
  usePassword = () => {
    this.globalService.triggerView$.next({ type: 'setting-password', payload: {} });
  }
  useSetting = () => {
    this.router.navigate(['core/setting']);
  }
}
