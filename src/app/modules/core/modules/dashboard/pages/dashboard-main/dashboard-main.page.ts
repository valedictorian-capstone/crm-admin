import { Component, OnInit } from '@angular/core';
import { StatisticService } from '@services';
import { tap, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.page.html',
  styleUrls: ['./dashboard-main.page.scss']
})
export class DashboardMainPage implements OnInit {
  customer = {
    month: {
      data: undefined,
      selected: new Date(),
    },
    year: {
      data: undefined,
      selected: new Date(),
    }
  };
  deal = {
    month: {
      data: undefined,
      selected: new Date(),
    },
    year: {
      data: undefined,
      selected: new Date(),
    }
  };
  total = {
    year: {
      data: undefined,
      selected: new Date(),
    }
  }
  date = new Date();
  constructor(
    protected readonly statisticService: StatisticService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.useLoadCustomerInYear();
    this.useLoadDealInYear();
    this.useLoadCustomerInMonth();
    this.useLoadDealInMonth();
    this.useLoadTotalInYear();
  }

  useLoadCustomerInYear = () => {
    this.useShowSpinner('customer-year');
    this.statisticService.findCustomerInYear(this.customer.year.selected.getFullYear())
      .pipe(
        tap((data) => this.customer.year.data = data),
        finalize(() => {
          this.useHideSpinner('customer-year');
        })
      ).subscribe();
  }
  useLoadDealInYear = () => {
    this.useShowSpinner('deal-year');
    this.statisticService
      .findDealInYear(this.deal.year.selected.getFullYear())
      .pipe(
        tap((data) => this.deal.year.data = data),
        finalize(() => {
          this.useHideSpinner('deal-year');
        })
      )
      .subscribe();
  }
  useLoadCustomerInMonth = () => {
    this.useShowSpinner('customer-month');
    this.statisticService
      .findCustomerInMonth(this.customer.month.selected.getMonth() + 1, this.customer.month.selected.getFullYear())
      .pipe(
        tap((data) => this.customer.month.data = data),
        finalize(() => {
          this.useHideSpinner('customer-month');
        })
      ).subscribe();
  }
  useLoadDealInMonth = () => {
    this.useShowSpinner('deal-month');
    this.statisticService.findDealInMonth(this.deal.month.selected.getMonth() + 1, this.customer.month.selected.getFullYear())
      .pipe(
        tap((data) => this.deal.month.data = data),
        finalize(() => {
          this.useHideSpinner('deal-month');
        })
      ).subscribe();
  }
  useLoadTotalInYear = () => {
    this.useShowSpinner('total-year');
    this.statisticService
      .findTotalInYear(this.total.year.selected.getFullYear())
      .pipe(
        tap((data) => this.total.year.data = data),
        finalize(() => {
          this.useHideSpinner('total-year');
        })
      )
      .subscribe();
  }
  useShowSpinner = (name: string) => {
    this.spinner.show(name);
  }
  useHideSpinner = (name: string) => {
    setTimeout(() => {
      this.spinner.hide(name);
    }, 1000);
  }
}
