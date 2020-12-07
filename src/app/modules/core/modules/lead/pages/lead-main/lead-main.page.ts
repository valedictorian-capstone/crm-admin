import { Component, OnInit } from '@angular/core';
import { AuthService, CustomerService, GlobalService } from '@services';
import { AccountVM, CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lead-main',
  templateUrl: './lead-main.page.html',
  styleUrls: ['./lead-main.page.scss'],
})
export class LeadMainPage implements OnInit {
  customers: CustomerVM[] = [];
  filterCustomers: CustomerVM[] = [];
  search = '';
  stage = 'done';
  you: AccountVM;
  canAdd = false;
  canImport = false;
  canUpdate = false;
  canRemove = false;
  constructor(
    protected readonly customerService: CustomerService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.useLoadMine();
    this.useReload();
    this.useSocket();
  }
  useLoadMine = () => {
    this.authService.auth(undefined).subscribe((data) => {
      this.canAdd = data.roles.filter((role) => role.canCreateCustomer).length > 0;
      this.canImport = data.roles.filter((role) => role.canImportCustomer).length > 0;
      this.canUpdate = data.roles.filter((role) => role.canUpdateCustomer).length > 0;
      this.canRemove = data.roles.filter((role) => role.canRemoveCustomer).length > 0;
    });
  }
  useSocket = () => {
    this.customerService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as CustomerVM).groups.filter((group) => group.id === '3').length > 0) {
        if (trigger.type === 'create') {
          this.customers.push((trigger.data as CustomerVM));
        } else if (trigger.type === 'update') {
          this.customers[this.customers.findIndex((e) => e.id === (trigger.data as CustomerVM).id)] = (trigger.data as CustomerVM);
        } else if (trigger.type === 'remove') {
          this.customers.splice(this.customers.findIndex((e) => e.id === (trigger.data as CustomerVM).id), 1);
        }
        this.useFilter();
      }
    });
  }
  useReload = () => {
    this.useShowSpinner();
    this.customerService.findAllLead()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.customers = data;
        this.useFilter();
      });
  }
  useFilter = () => {
    this.filterCustomers = this.customers.filter((e) =>
      e.fullname.toLowerCase().includes(this.search.toLowerCase()) ||
      e.phone.toLowerCase().includes(this.search.toLowerCase()) ||
      e.email.toLowerCase().includes(this.search.toLowerCase())
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'customer' } });
  }
  useShowSpinner = () => {
    this.spinner.show('lead-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('lead-main');
    }, 1000);
  }
}
