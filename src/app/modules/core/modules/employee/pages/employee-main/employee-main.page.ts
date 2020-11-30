import { Component, OnInit } from '@angular/core';
import { AccountService, GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-employee-main',
  templateUrl: './employee-main.page.html',
  styleUrls: ['./employee-main.page.scss'],
})
export class EmployeeMainPage implements OnInit {
  employees: AccountVM[] = [];
  filterEmployees: AccountVM[] = [];
  search = '';
  stage = 'done';
  constructor(
    protected readonly employeeService: AccountService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.useReload();
    this.useTrigger();
  }
  useTrigger = () => {
    this.employeeService.triggerValue$.subscribe((trigger) => {
        if (trigger.type === 'create') {
          this.employees.push(trigger.data);
        } else if (trigger.type === 'update') {
          this.employees[this.employees.findIndex((e) => e.id === trigger.data.id)] = trigger.data;
        } else {
          this.employees.splice(this.employees.findIndex((e) => e.id === trigger.data.id), 1);
        }
        this.useFilter();
    });
  }
  useReload = () => {
    this.useShowSpinner();
    this.employeeService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.employees = data;
        this.useFilter();
      });
  }
  useFilter = () => {
    this.filterEmployees = this.employees.filter((e) =>
      e.fullname.toLowerCase().includes(this.search.toLowerCase()) ||
      e.phone.toLowerCase().includes(this.search.toLowerCase()) ||
      e.email.toLowerCase().includes(this.search.toLowerCase())
    );
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'employee' } });
  }
  useShowSpinner = () => {
    this.spinner.show('employee-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('employee-main');
    }, 1000);
  }
}
