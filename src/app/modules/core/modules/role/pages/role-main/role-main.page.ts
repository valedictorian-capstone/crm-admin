import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { AccountService, GlobalService, RoleService } from '@services';
import { AccountVM, RoleVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-role-main',
  templateUrl: './role-main.page.html',
  styleUrls: ['./role-main.page.scss']
})
export class RoleMainPage implements OnInit {

  roles: RoleVM[] = [];
  filterRoles: RoleVM[] = [];
  accounts: (AccountVM & { selected?: boolean })[] = [];
  filterAccounts: (AccountVM & { selected?: boolean })[] = [];
  selectedRole = new FormGroup({
    id: new FormControl(undefined),
    name: new FormControl('', [Validators.required]),
    notChange: new FormControl(false),
    level: new FormControl(0),
    description: new FormControl(''),
    accounts: new FormControl([]),
    canAccessRole: new FormControl(false),
    canCreateRole: new FormControl(false),
    canUpdateRole: new FormControl(false),
    canRemoveRole: new FormControl(false),
    canImportRole: new FormControl(false),
    canExportRole: new FormControl(false),

    canAccessEmployee: new FormControl(false),
    canCreateEmployee: new FormControl(false),
    canUpdateEmployee: new FormControl(false),
    canRemoveEmployee: new FormControl(false),
    canImportEmployee: new FormControl(false),
    canExportEmployee: new FormControl(false),

    canAccessDeal: new FormControl(false),
    canCreateDeal: new FormControl(false),
    canUpdateDeal: new FormControl(false),
    canRemoveDeal: new FormControl(false),
    canImportDeal: new FormControl(false),
    canExportDeal: new FormControl(false),

    canAccessActivity: new FormControl(false),
    canCreateActivity: new FormControl(false),
    canUpdateActivity: new FormControl(false),
    canRemoveActivity: new FormControl(false),
    canImportActivity: new FormControl(false),
    canExportActivity: new FormControl(false),

    canAccessCustomer: new FormControl(false),
    canCreateCustomer: new FormControl(false),
    canUpdateCustomer: new FormControl(false),
    canRemoveCustomer: new FormControl(false),
    canImportCustomer: new FormControl(false),
    canExportCustomer: new FormControl(false),

    canAccessProduct: new FormControl(false),
    canCreateProduct: new FormControl(false),
    canUpdateProduct: new FormControl(false),
    canRemoveProduct: new FormControl(false),
    canImportProduct: new FormControl(false),
    canExportProduct: new FormControl(false),

    canAccessTicket: new FormControl(false),
    canCreateTicket: new FormControl(false),
    canUpdateTicket: new FormControl(false),
    canRemoveTicket: new FormControl(false),
    canImportTicket: new FormControl(false),
    canExportTicket: new FormControl(false),

    canAccessFeedback: new FormControl(false),
    canCreateFeedback: new FormControl(false),
    canUpdateFeedback: new FormControl(false),
    canRemoveFeedback: new FormControl(false),
    canImportFeedback: new FormControl(false),
    canExportFeedback: new FormControl(false),

    canAccessProcess: new FormControl(false),
    canCreateProcess: new FormControl(false),
    canUpdateProcess: new FormControl(false),
    canRemoveProcess: new FormControl(false),
    canImportProcess: new FormControl(false),
    canExportProcess: new FormControl(false),

    canAccessEvent: new FormControl(false),
    canCreateEvent: new FormControl(false),
    canUpdateEvent: new FormControl(false),
    canRemoveEvent: new FormControl(false),
    canImportEvent: new FormControl(false),
    canExportEvent: new FormControl(false),
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
  permissions = ['Role', 'Employee', 'Deal', 'Customer', 'Activity', 'Ticket', 'Feedback', 'Process', 'Event'].map((role) => ([
    {
      label: 'Access ' + role,
      value: 'canAccess' + role,
    },
    {
      label: 'Create ' + role,
      value: 'canCreate' + role,
    },
    {
      label: 'Update ' + role,
      value: 'canUpdate' + role,
    },
    {
      label: 'Remove ' + role,
      value: 'canRemove' + role,
    },
    {
      label: 'Import ' + role,
      value: 'canImport' + role,
    },
    {
      label: 'Export ' + role,
      value: 'canExport' + role,
    },
  ]));
  constructor(
    protected readonly roleService: RoleService,
    protected readonly accountService: AccountService,
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.useReload();
    this.useSocketAccount();
    this.useSocket();
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
      notChange: false,
      level: 10,
      description: '',
      canAccessRole: false,
      canCreateRole: false,
      canUpdateRole: false,
      canRemoveRole: false,
      canImportRole: false,
      canExportRole: false,
      canAccessEmployee: false,
      canCreateEmployee: false,
      canUpdateEmployee: false,
      canRemoveEmployee: false,
      canImportEmployee: false,
      canExportEmployee: false,
      canAccessDeal: false,
      canCreateDeal: false,
      canUpdateDeal: false,
      canRemoveDeal: false,
      canImportDeal: false,
      canExportDeal: false,
      canAccessActivity: false,
      canCreateActivity: false,
      canUpdateActivity: false,
      canRemoveActivity: false,
      canImportActivity: false,
      canExportActivity: false,
      canAccessCustomer: false,
      canCreateCustomer: false,
      canUpdateCustomer: false,
      canRemoveCustomer: false,
      canImportCustomer: false,
      canExportCustomer: false,
      canAccessProduct: false,
      canCreateProduct: false,
      canUpdateProduct: false,
      canRemoveProduct: false,
      canImportProduct: false,
      canExportProduct: false,
      canAccessTicket: false,
      canCreateTicket: false,
      canUpdateTicket: false,
      canRemoveTicket: false,
      canImportTicket: false,
      canExportTicket: false,
      canAccessFeedback: false,
      canCreateFeedback: false,
      canUpdateFeedback: false,
      canRemoveFeedback: false,
      canImportFeedback: false,
      canExportFeedback: false,
      canAccessProcess: false,
      canCreateProcess: false,
      canUpdateProcess: false,
      canRemoveProcess: false,
      canImportProcess: false,
      canExportProcess: false,
      canAccessEvent: false,
      canCreateEvent: false,
      canUpdateEvent: false,
      canRemoveEvent: false,
      canImportEvent: false,
      canExportEvent: false,
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
