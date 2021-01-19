import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICustomerSearch } from '@extras/features/customer';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { tap, catchError } from 'rxjs/operators';
import { GroupAction } from '@store/actions';
import { of } from 'rxjs';
import { GroupVM } from '@view-models';
@Component({
  selector: 'app-customer-query',
  templateUrl: './customer-query.component.html',
  styleUrls: ['./customer-query.component.scss']
})
export class CustomerQueryComponent {
  @Input() search: ICustomerSearch;
  @Input() isMain: boolean;
  @Input() queryGroup: boolean;
  @Output() useSearch: EventEmitter<ICustomerSearch> = new EventEmitter<ICustomerSearch>();
  show = false;
  groups: GroupVM[] = [];
  constructor(
    protected readonly store: Store<State>
  ) {
    this.useLoadGroup();
  }
  useLoadGroup = () => {
    this.store.select((state) => state.group)
      .pipe(
        tap((group) => {
          const firstLoad = group.firstLoad;
          const data = (group.ids as string[]).map((id) => group.entities[id]);
          console.log(group);
          if (!firstLoad) {
            this.store.dispatch(GroupAction.FindAllAction({}));
          } else {
            this.groups = data;
          }
        }),
        catchError((err) => {
          console.log(err);
          return of(undefined);
        })
      ).subscribe();
  }
  useClear = () => {
    this.search = {
      value: '',
      genders: [],
      groups: [],
    };
    this.useSearch.emit(this.search);
  }
}
