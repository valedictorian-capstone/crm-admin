import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { RoleAction } from '@store/actions';
import { State } from '@store/states';
import { RoleVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface IRoleSelectComponentState {
  search: string;
  array: RoleVM[];
  filterArray: RoleVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.scss']
})
export class RoleSelectComponent implements OnInit, OnDestroy {
  @Input() modelChange: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Input() control: FormControl;
  @Input() model: RoleVM;
  subscriptions: Subscription[] = [];
  state: IRoleSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.role)
      .pipe(
        tap((role) => {
          const firstLoad = role.firstLoad;
          const data = (role.ids as string[]).map((id) => role.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.array = data;
            this.useSearch();
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(RoleAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((role) => role.name.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('role-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('role-select');
  }
  useSelectItem(item: RoleVM) {
    if (this.control) {
      this.control.setValue(item);
    }
    this.model = item;
    this.modelChange.emit(item);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
