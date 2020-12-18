import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalService } from '@services';
import { RoleAction } from '@store/actions';
import { State } from '@store/states';
import { RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-role-information',
  templateUrl: './role-information.component.html',
  styleUrls: ['./role-information.component.scss']
})
export class RoleInformationComponent implements OnInit, OnDestroy {
  @Input() selectedRole: RoleVM;
  @Output() useSelect: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  roles: RoleVM[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly store: Store<State>,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
  ) { }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.store.select((state) => state.role)
        .pipe(
          tap((role) => {
            const firstLoad = role.firstLoad;
            const data = (role.ids as string[]).map((id) => role.entities[id]);
            if (!firstLoad) {
              this.useReload();
            } else {
              this.roles = data;
              if (this.selectedRole) {
                this.selectedRole = this.roles.find((role) => role.id === this.selectedRole.id);
              }
            }
          }),
        ).subscribe()
    );
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(RoleAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useShowSpinner = () => {
    this.spinner.show('role-information');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-information');
    }, 1000);
  }
  useRemove = () => {
  }
  useEdit = (role: RoleVM) => {
    this.globalService.triggerView$.next({ type: 'setting-role', payload: { role } });
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'setting-role', payload: {} });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
