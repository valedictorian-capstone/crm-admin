import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ActivatedRoute, CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { DeviceDetectorService } from 'ngx-device-detector';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanLoad {
  constructor(
    protected readonly authService: AuthService,
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly angularFireMessaging: AngularFireMessaging,
    protected readonly store: Store<State>
  ) { }
  canLoad(route: Route, segments: UrlSegment[]) {
    console.log(route);
    return this.store.select(authSelector.profile)
      .pipe(
        tap(console.log),
        map((res) => {
          if (res) {
            return true;
          }
          this.router.navigate(['auth'], {
            queryParams: {
              returnUrl: document.location.href.toString().substring(
                document.location.href.indexOf('core'),
                document.location.href.length
              )
            }
          });
          return false;
        }),
        catchError(() => {
          this.router.navigate(['auth'], {
            queryParams: {
              returnUrl: document.location.href.toString().substring(
                document.location.href.indexOf('core'),
                document.location.href.length
              )
            }
          });
          return of(false);
        })
      );
  }
}
