import { Component, OnInit } from '@angular/core';
import { CustomerService, GlobalService, GroupService } from '@services';
import { CustomerVM, GroupVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contact-main',
  templateUrl: './contact-main.page.html',
  styleUrls: ['./contact-main.page.scss'],
})
export class ContactMainPage implements OnInit {
  customers: CustomerVM[] = [];
  filterCustomers: CustomerVM[] = [];
  groups: GroupVM[] = [];
  search = '';
  stage = 'done';
  selectedGroup = '';
  constructor(
    protected readonly customerService: CustomerService,
    protected readonly groupService: GroupService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.useLoadGroup();
    this.useReload();
    this.useSocket();
  }
  useSocket = () => {
    this.customerService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.customers.push(trigger.data as CustomerVM);
      } else if (trigger.type === 'update') {
        this.customers[this.customers.findIndex((e) => e.id === (trigger.data as CustomerVM).id)] = (trigger.data as CustomerVM);
      } else if (trigger.type === 'remove') {
        this.customers.splice(this.customers.findIndex((e) => e.id === (trigger.data as CustomerVM).id), 1);
      }
      this.useFilter();
    });
  }
  useLoadGroup = () => {
    this.groupService.findAll().subscribe((data) => this.groups = data);
  }
  useReload = () => {
    this.useShowSpinner();
    this.customerService.findAll()
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
      (e.fullname.toLowerCase().includes(this.search.toLowerCase()) ||
        e.phone.toLowerCase().includes(this.search.toLowerCase()) ||
        e.email.toLowerCase().includes(this.search.toLowerCase()))
      && e.groups.filter((group) => group.id.includes(this.selectedGroup)).length > 0
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'customer', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'customer' } });
  }
  useShowSpinner = () => {
    this.spinner.show('contact-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('contact-main');
    }, 1000);
  }
}
