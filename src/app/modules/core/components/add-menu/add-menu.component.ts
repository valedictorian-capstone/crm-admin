import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { Store } from '@ngrx/store';
import { GlobalService } from '@services';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { authSelector } from '@store/selectors';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  state: { you: AccountVM, menus: any[] } = {
    you: undefined,
    menus: []
  };
  constructor(
    protected readonly globalService: GlobalService,
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
            this.state.you = profile;
            this.state.menus = environment.createMenus.filter((item) => this.useCheckRole(item.can));
          })
        )
        .subscribe()
    );
  }
  useSelect = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: {} });
  }
  useCheckRole = (name: string | string[]) => {
    if (typeof name === 'string') {
      return this.state.you.roles.filter((role) => role[name]).length > 0;
    } else {
      return this.state.you.roles.filter((role) => name.filter((e) => role[e]).length > 0).length > 0;
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
