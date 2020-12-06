import { Component, Input, OnInit } from '@angular/core';
import { DealVM } from '@view-models';
import { DealService } from '@services';

@Component({
  selector: 'app-dashboard-deal-in-month',
  templateUrl: './dashboard-deal-in-month.component.html',
  styleUrls: ['./dashboard-deal-in-month.component.scss']
})
export class DashboardDealInMonthComponent implements OnInit {
  @Input() set data(statuss: { status: string, data: DealVM[] }[]) {
    this.statuss = statuss;
    this.deals = [];
    this.statuss.forEach((status) => this.deals = this.deals.concat(status.data));
    this.useFilter();
  }
  filterDeals: DealVM[] = [];
  deals: DealVM[] = [];
  search = {
    status: undefined,
    title: '',
  };
  statuss: { status: string, data: DealVM[] }[] = [];
  constructor(
  ) { }

  ngOnInit() {
    this.useFilter();
  }
  useFilter = () => {
    this.filterDeals = [];
    if (!this.search.status) {
      this.filterDeals = this.deals.filter((deal) => deal.title.toLowerCase().includes(this.search.title.toLowerCase()));
    } else {
      this.filterDeals = this.statuss.find((e) => e.status === this.search.status.status).data
        .filter((deal) => deal.title.toLowerCase().includes(this.search.title.toLowerCase()));
    }
    console.log(this.search.status);
  }
}
