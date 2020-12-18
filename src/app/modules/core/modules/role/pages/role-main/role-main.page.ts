import { AccountAction } from '@actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GlobalService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM, RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

interface IRoleMainPageState {
  you: AccountVM;
  array: AccountVM[];
  filterArray: AccountVM[];
  selectedRole: RoleVM;
  search: {
    value: string,
  };
  permissions: [{ label: string, value: string }[]];
}
@Component({
  selector: 'app-role-main',
  templateUrl: './role-main.page.html',
  styleUrls: ['./role-main.page.scss']
})
export class RoleMainPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IRoleMainPageState = {
    you: undefined,
    array: [],
    filterArray: [],
    selectedRole: undefined,
    search: {
      value: '',
    },
    permissions: [[
      {
        label: 'AccessDeal',
        value: 'canAccessDeal'
      },
      {
        label: 'GetAllDeal',
        value: 'canGetAllDeal'
      },
      {
        label: 'AssignDeal',
        value: 'canAssignDeal'
      },
      {
        label: 'CreateDeal',
        value: 'canCreateDeal'
      },
      {
        label: 'UpdateDeal',
        value: 'canUpdateDeal'
      },
      {
        label: 'RemoveDeal',
        value: 'canRemoveDeal'
      },
      {
        label: 'CreateProcess',
        value: 'canCreateProcess'
      },
      {
        label: 'UpdateProcess',
        value: 'canUpdateProcess'
      },
      {
        label: 'RemoveProcess',
        value: 'canRemoveProcess'
      },
      {
        label: 'AccessRole',
        value: 'canAccessRole'
      },
      {
        label: 'AccessCustomer',
        value: 'canAccessCustomer'
      },
      {
        label: 'AssignCustomer',
        value: 'canAssignCustomer'
      },
      {
        label: 'GetAllCustomer',
        value: 'canGetAllCustomer'
      },
      {
        label: 'CreateCustomer',
        value: 'canCreateCustomer'
      },
      {
        label: 'UpdateCustomer',
        value: 'canUpdateCustomer'
      },
      {
        label: 'RemoveCustomer',
        value: 'canRemoveCustomer'
      },
      {
        label: 'ImportCustomer',
        value: 'canImportCustomer'
      },
      {
        label: 'AssignActivity',
        value: 'canAssignActivity'
      },
      {
        label: 'GetAllActivity',
        value: 'canGetAllActivity'
      },
      {
        label: 'AccessTicket',
        value: 'canAccessTicket'
      },
      {
        label: 'GetTicketDeal',
        value: 'canGetTicketDeal'
      },
      {
        label: 'GetTicketSupport',
        value: 'canGetTicketSupport'
      },
      {
        label: 'UpdateTicket',
        value: 'canUpdateTicket'
      },
      {
        label: 'RemoveTicket',
        value: 'canRemoveTicket'
      },
      {
        label: 'ImportEmployee',
        value: 'canImportEmployee'
      },
      {
        label: 'AccessProduct',
        value: 'canAccessProduct'
      },
      {
        label: 'CreateProduct',
        value: 'canCreateProduct'
      },
      {
        label: 'UpdateProduct',
        value: 'canUpdateProduct'
      },
      {
        label: 'RemoveProduct',
        value: 'canRemoveProduct'
      },
      {
        label: 'ImportProduct',
        value: 'canImportProduct'
      },
      {
        label: 'AccessEvent',
        value: 'canAccessEvent'
      },
      {
        label: 'CreateEvent',
        value: 'canCreateEvent'
      },
      {
        label: 'UpdateEvent',
        value: 'canUpdateEvent'
      },
      {
        label: 'RemoveEvent',
        value: 'canRemoveEvent'
      },
    ]],
  }
  constructor(
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }

  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            this.state.you = profile;
          })
        )
        .subscribe()
    );
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select((state) => state.account)
        .pipe(
          tap((account) => {
            const firstLoad = account.firstLoad;
            const data = (account.ids as string[]).map((id) => account.entities[id]);
            if (!firstLoad) {
              this.useReload();
            } else {
              this.state.array = data.filter((e) => e.id !== this.state.you.id);
              this.useFilter();
            }
          }),
        ).subscribe()
    );
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(AccountAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: {} });
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (e.fullname.toLowerCase().includes(this.state.search.value.toLowerCase()) ||
        e.phone.toLowerCase().includes(this.state.search.value.toLowerCase()) ||
      e.email.toLowerCase().includes(this.state.search.value.toLowerCase()))
    );
  }
  useSearch = (search: {
    value: string;
  }) => {
    this.state.search = { ...this.state.search, ...search };
    this.useFilter();
  }
  useShowSpinner = () => {
    this.spinner.show('role-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-main');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
