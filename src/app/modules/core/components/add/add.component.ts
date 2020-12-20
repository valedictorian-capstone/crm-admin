import { Component, OnDestroy } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngrx/store';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  state: { you: AccountVM, toggle: boolean, menus: any[] } = {
    toggle: false,
    you: undefined,
    menus: []
  };
  constructor(
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
              this.state.menus = environment.createMenus.filter((item) => this.useCheckRole(item.can));
            }
          })
        )
        .subscribe()
    );
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
