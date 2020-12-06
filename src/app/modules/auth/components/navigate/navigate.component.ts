import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, TokenService } from '@services';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {
  device;
  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    protected readonly authService: AuthService,
    protected readonly tokenService: TokenService,
    protected readonly angularFireMessaging: AngularFireMessaging,
    protected readonly deviceService: DeviceDetectorService,
  ) {
  }

  ngOnInit() {
    this.useCHeckNotification();
  }
  useCHeckNotification = async () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      this.useRouting(undefined);
    } else {
      const fcmToken = await this.angularFireMessaging.getToken.toPromise();
      localStorage.setItem('fcmToken', fcmToken);
      this.useRouting(fcmToken);
    }
  }
  useRouting = (fcmToken: string) => {
    this.authService.auth({ id: fcmToken, ...this.deviceService.getDeviceInfo() } as any).subscribe(
      (data) => {
        setTimeout(() => {
          this.router.navigate(['core']);
        }, 1000);
      },
      (err) => {
        this.tokenService.clearToken();
        this.router.navigate(['auth/login']);
      }
    );
  }
}
