import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector } from '@store/selectors';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  state: { you: AccountVM, array: any[], more: any[], showMore: boolean, active: string } = {
    you: undefined,
    array: [],
    more: [],
    showMore: false,
    active: ''
  };
  constructor(
    protected readonly router: Router,
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
              this.state.more = [];
              this.state.array = [];
              const array = environment.categories.filter((item) => this.useCheckRole(item.can));
              if (array.length > 4) {
                for (let i = 0; i < 3; i++) {
                  this.state.array.push(array[i]);
                }
                for (let i = 3; i < array.length; i++) {
                  this.state.more.push(array[i]);
                }
              } else {
                this.state.array = array;
              }
              this.useUpdate();
            }
          })
        )
        .subscribe()
    );
  }
  useUpdate = (link?: string) => {
    if (link) {
      this.state.active = link;
      this.router.navigate(['core/' + link]);
    } else {
      this.state.active = document.location.hash.replace('#/core/', '').split('/')[0];
      this.state.active = this.state.active === 'deal' ? 'process' : this.state.active;
    }
  }
  useCheckRole = (name: string) => {
    return this.state.you.roles.filter((role) => role[name]).length > 0;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
