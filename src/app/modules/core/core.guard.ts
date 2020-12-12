import { AngularFireMessaging } from '@angular/fire/messaging';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, of } from 'rxjs';
import { RoleVM } from '@view-models';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector } from '@store/selectors';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreGuard implements CanLoad {
  constructor(
    protected readonly authService: AuthService,
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly angularFireMessaging: AngularFireMessaging,
    protected readonly store: Store<State>
  ) { }
  canLoad(route: Route, segments: UrlSegment[]) {
    this.store.select((state) => state.router.state.url).subscribe((data) => console.log('core-store', data));
    console.log('core-location: ', document.location.href);
    console.log('core-router: ', this.router.url);
    console.log('core-route: ', route);
    console.log('core-activated: ', this.activatedRoute.url);
    return this.store.select(authSelector.profile)
      .pipe(
        tap(console.log),
        map((res) => {
          if (res) {
            let check = false;
            for (const role of res.roles) {
              if (role['canAccess' + route.data.permission]) {
                check = true;
              }
            }
            if (check) {
              return true;
            } else {
              this.router.navigate(['auth']);
              return false;
            }
          }
          this.router.navigate(['auth']);
          return false;
        }),
        catchError(() => {
          this.router.navigate(['auth']);
          return of(false);
        })
      );
  }
}
