import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DeviceService, GlobalService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  state: { you: AccountVM, canSetting: boolean } = {
    you: undefined,
    canSetting: false
  }
  constructor(
    protected readonly service: DeviceService,
    protected readonly router: Router,
    protected readonly globalService: GlobalService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }

  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              if (Math.min(...this.state.you.roles.map((e) => e.level)) <= 0) {
                this.state.canSetting = true;
              }
            }
          })
        )
        .subscribe()
    );
  }
  useOut = async () => {
    const selectedPipeline = localStorage.getItem('selectedPipeline');
    localStorage.clear();
    if (selectedPipeline) {
      localStorage.setItem('selectedPipeline', selectedPipeline);
    }
    this.router.navigate(['auth/login']);
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
