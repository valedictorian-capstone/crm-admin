import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { AccountService, GlobalService, RoleService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, tap, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { authSelector, roleSelector } from '@store/selectors';
import { AccountAction, RoleAction } from '@actions';

@Component({
  selector: 'app-role-main',
  templateUrl: './role-main.page.html',
  styleUrls: ['./role-main.page.scss']
})
export class RoleMainPage implements OnInit {
  you: AccountVM;
  roles: RoleVM[] = [];
  filterRoles: RoleVM[] = [];
  accounts: (AccountVM & { selected?: boolean })[] = [];
  filterAccounts: (AccountVM & { selected?: boolean })[] = [];
  selectedRole = new FormGroup({
    id: new FormControl(undefined),
    name: new FormControl('', [Validators.required]),
    level: new FormControl(0),
    description: new FormControl(''),
    accounts: new FormControl([]),
    canAccessDeal: new FormControl(false),
    canGetAllDeal: new FormControl(false),
    canAssignDeal: new FormControl(false),
    canCreateDeal: new FormControl(false),
    canUpdateDeal: new FormControl(false),
    canRemoveDeal: new FormControl(false),
    canCreateProcess: new FormControl(false),
    canUpdateProcess: new FormControl(false),
    canRemoveProcess: new FormControl(false),
    canAccessRole: new FormControl(false),
    canAccessCustomer: new FormControl(false),
    canAssignCustomer: new FormControl(false),
    canGetAllCustomer: new FormControl(false),
    canCreateCustomer: new FormControl(false),
    canUpdateCustomer: new FormControl(false),
    canRemoveCustomer: new FormControl(false),
    canImportCustomer: new FormControl(false),
    canAssignActivity: new FormControl(false),
    canGetAllActivity: new FormControl(false),
    canAccessTicket: new FormControl(false),
    canGetTicketDeal: new FormControl(false),
    canGetTicketSupport: new FormControl(false),
    canUpdateTicket: new FormControl(false),
    canRemoveTicket: new FormControl(false),
    canImportEmployee: new FormControl(false),
    canAccessProduct: new FormControl(false),
    canCreateProduct: new FormControl(false),
    canUpdateProduct: new FormControl(false),
    canRemoveProduct: new FormControl(false),
    canImportProduct: new FormControl(false),
    canAccessEvent: new FormControl(false),
    canCreateEvent: new FormControl(false),
    canUpdateEvent: new FormControl(false),
    canRemoveEvent: new FormControl(false),
  });
  type = 'edit';
  search = {
    role: {
      value: '',
      stage: 'done'
    },
    account: {
      value: '',
      stage: 'done'
    }
  };
  permissions = [[
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
  ]];
  constructor(
    protected readonly roleService: RoleService,
    protected readonly accountService: AccountService,
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    // store.dispatch(AccountAction.FindAllAction());
    store.dispatch(RoleAction.FindAllAction({}));
    store.select(roleSelector.roles)
      .pipe(
        tap((data) => {
          console.log('test-store', data);
        })
      ).subscribe();
    this.useLoadMine();
  }

  ngOnInit() {
    console.log(this.permissions);
    this.useReload();
    this.useSocketAccount();
    this.useSocket();
  }
  useLoadMine = () => {
    this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.you = profile;
        })
      )
      .subscribe()
  }
  useReload = () => {
    this.useShowSpinner();
    this.accountService.findAll()
      .pipe(
        tap((data) => {
          this.accounts = data;
          this.useFilterAccount();
        }),
        switchMap(() => this.roleService.findAll()),
        tap((data) => {
          this.roles = data;
          this.useFilter();
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe();
  }
  useSocket = () => {
    this.roleService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.roles.push((trigger.data as RoleVM));
      } else if (trigger.type === 'update') {
        this.roles[this.roles.findIndex((e) => e.id === (trigger.data as RoleVM).id)] = (trigger.data as RoleVM);
      } else if (trigger.type === 'remove') {
        this.roles.splice(this.roles.findIndex((e) => e.id === (trigger.data as RoleVM).id), 1);
      }
      this.useFilter();
    });
  }
  useSocketAccount = () => {
    this.accountService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.accounts.push((trigger.data as AccountVM));
        this.useAddAccountToRole((trigger.data as AccountVM));
      } else if (trigger.type === 'update') {
        this.accounts[this.accounts.findIndex((e) => e.id === (trigger.data as AccountVM).id)] = (trigger.data as AccountVM);
        this.useUpdateAccountToRole((trigger.data as AccountVM));
      } else if (trigger.type === 'remove') {
        this.accounts.splice(this.accounts.findIndex((e) => e.id === (trigger.data as AccountVM).id), 1);
        this.useRemoveAccountToRole((trigger.data as AccountVM));
      }
      this.useSetAccountRole();
    });
  }
  usePlus = () => {
    this.useShowSpinner();
    this.selectedRole.reset({
      id: undefined,
      name: '',
      accounts: [],
      level: 10,
      description: '',
      canAccessDeal: false,
      canGetAllDeal: false,
      canAssignDeal: false,
      canCreateDeal: false,
      canUpdateDeal: false,
      canRemoveDeal: false,
      canCreateProcess: false,
      canUpdateProcess: false,
      canRemoveProcess: false,
      canAccessRole: false,
      canAccessCustomer: false,
      canAssignCustomer: false,
      canGetAllCustomer: false,
      canCreateCustomer: false,
      canUpdateCustomer: false,
      canRemoveCustomer: false,
      canImportCustomer: false,
      canAssignActivity: false,
      canGetAllActivity: false,
      canAccessTicket: false,
      canGetTicketDeal: false,
      canGetTicketSupport: false,
      canUpdateTicket: false,
      canRemoveTicket: false,
      canImportEmployee: false,
      canAccessProduct: false,
      canCreateProduct: false,
      canUpdateProduct: false,
      canRemoveProduct: false,
      canImportProduct: false,
      canAccessEvent: false,
      canCreateEvent: false,
      canUpdateEvent: false,
      canRemoveEvent: false,
    });
    this.useSetAccountRole();
    this.useHideSpinner();
  }
  useSelectRole = (role: RoleVM) => {
    this.useShowSpinner();
    this.selectedRole.reset(role);
    this.useSetAccountRole();
    this.useHideSpinner();
  }
  useFilter = () => {
    this.search.role.stage = 'querying';
    this.filterRoles = this.roles.filter((role) => role.name.toLowerCase().includes(this.search.role.value.toLowerCase()));
    if (this.filterRoles.length > 0 && !this.filterRoles.find((role) => role.id === this.selectedRole.value.id)) {
      this.useSelectRole(this.filterRoles[0]);
    }
    this.search.role.stage = 'done';
  }
  useFilterAccount = () => {
    this.search.account.stage = 'querying';
    this.filterAccounts = this.accounts.filter((account) =>
      account.fullname.toLowerCase().includes(this.search.account.value.toLowerCase()) ||
      account.phone.toLowerCase().includes(this.search.account.value.toLowerCase()) ||
      account.email.toLowerCase().includes(this.search.account.value.toLowerCase())
    );
    this.search.account.stage = 'done';
  }
  useMinusLevel = () => {
    if (this.selectedRole.get('level').value > 1) {
      this.selectedRole.get('level').setValue(this.selectedRole.get('level').value - 1);
    }
  }
  usePlusLevel = () => {
    this.selectedRole.get('level').setValue(this.selectedRole.get('level').value + 1);
  }
  useSubmit = () => {
    if (this.selectedRole.valid) {
      this.useShowSpinner();
      (this.selectedRole.value.id != null
        ? this.roleService.update(this.selectedRole.value)
        : this.roleService.insert({ ...this.selectedRole.value, id: undefined }))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save role successful!', { duration: 3000 });
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      this.selectedRole.markAsUntouched();
      this.selectedRole.markAsTouched();
    }
  }
  useSetAccountRole = () => {
    const accounts: AccountVM[] = this.selectedRole.value.accounts;
    this.accounts = this.accounts.map((account) => ({ ...account, selected: accounts.findIndex((acc) => acc.id === account.id) > -1 }));
    this.useFilterAccount();
  }
  usePlusAccount = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: {} });
  }
  useToggleAccount = (account: (AccountVM & { selected?: boolean }), selected?: boolean) => {
    this.accounts.find((acc) => acc.id === account.id).selected = selected;
    this.selectedRole.get('accounts').setValue(this.accounts.filter((acc) => acc.selected));
  }
  useShowSpinner = () => {
    this.spinner.show('role-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-main');
    }, 1000);
  }
  useAddAccountToRole = (account: AccountVM) => {
    for (const role of this.roles) {
      const pos = account.roles.findIndex((r) => r.id === role.id);
      if (pos > -1) {
        role.accounts.push(account);
      }
      if (this.selectedRole.value.id === role.id) {
        this.selectedRole.reset(role);
      }
    }
    this.useFilter();
  }
  useUpdateAccountToRole = (account: AccountVM) => {
    for (const role of this.roles) {
      const pos = account.roles.findIndex((r) => r.id === role.id);
      if (pos > -1) {
        role.accounts[pos] = account;
      } else {
        const accPos = role.accounts.findIndex((acc) => acc.id === account.id);
        if (accPos > -1) {
          role.accounts.splice(accPos, 1);
        }
      }
      if (this.selectedRole.value.id === role.id) {
        this.selectedRole.reset(role);
      }
    }
    this.useFilter();
  }
  useRemoveAccountToRole = (account: AccountVM) => {
    for (const role of this.roles) {
      const pos = role.accounts.findIndex((acc) => acc.id === account.id);
      if (pos > -1) {
        role.accounts.splice(pos, 1);
      }
      if (this.selectedRole.value.id === role.id) {
        this.selectedRole.reset(role);
      }
    }
    this.useFilter();
  }
}
