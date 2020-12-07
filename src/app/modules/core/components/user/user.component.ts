import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DeviceService, GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() you: AccountVM;
  @Input() canSetting = false;
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
