import { Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GroupAction } from '@store/actions';
import { groupSelector } from '@store/selectors';
import { State } from '@store/states';
import { GroupVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.scss']
})
export class ContactSearchComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    value: '',
    group: undefined
  };
  groups: GroupVM[] = [];
  constructor(
    protected readonly store: Store<State>
  ) {}
  ngOnInit() {
    this.useDispatch();
    this.useData();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(groupSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(GroupAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
  }
  useData = () => {
    this.subscriptions.push(
      this.store.select(groupSelector.groups)
        .pipe(
          tap((data) => {
            this.groups = data;
          })
      ).subscribe()
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
