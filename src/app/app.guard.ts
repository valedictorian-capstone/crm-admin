import { AngularFireMessaging } from '@angular/fire/messaging';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { AuthService } from './services/extra-services';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanLoad {
  constructor(
    protected readonly authService: AuthService,
    protected readonly router: Router,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly angularFireMessaging: AngularFireMessaging,
  ) { }
  async canLoad(route: Route, segments: UrlSegment[]){
    if (Notification.permission === 'denied' || !('Notification' in window)) {
    } else {
      if (!localStorage.getItem('fcmToken')) {
        const fcmToken = await this.angularFireMessaging.getToken.toPromise();
        localStorage.setItem('fcmToken', fcmToken);
      }
    }
    return this.authService.auth({id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo()} as any).toPromise()
      .then((res) => {
        return true;
      }).catch((err) => {
        this.router.navigate(['auth']);
        return false;
      });
  }

}
