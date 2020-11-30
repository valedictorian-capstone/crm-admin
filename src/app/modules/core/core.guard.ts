import { AngularFireMessaging } from '@angular/fire/messaging';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '@services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreGuard implements CanLoad {
  constructor(
    protected readonly authService: AuthService,
    protected readonly router: Router,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly angularFireMessaging: AngularFireMessaging,
  ) { }
  async canLoad(route: Route, segments: UrlSegment[]) {
    if (Notification.permission === 'denied' || !('Notification' in window)) {
    } else {
      if (!localStorage.getItem('fcmToken')) {
        const fcmToken = await this.angularFireMessaging.getToken.toPromise();
        localStorage.setItem('fcmToken', fcmToken);
      }
    }

    return this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any).toPromise()
      .then((res) => {
        const permission = 'canAccess' + route.data.permission;
        let check = false;
        for (const role of res.roles) {
          if (role[permission]) {
            check = true;
          }
        }
        if (check) {
          return true;
        } else {
          this.router.navigate(['auth']);
          return false;
        }
      }).catch((err) => {
        this.router.navigate(['auth']);
        return false;
      });
  }
}
