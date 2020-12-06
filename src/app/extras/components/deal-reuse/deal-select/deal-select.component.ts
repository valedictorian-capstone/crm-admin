import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DealService } from '@services';
import { DealVM } from '@view-models';

@Component({
  selector: 'app-reuse-deal-select',
  templateUrl: './deal-select.component.html',
  styleUrls: ['./deal-select.component.scss']
})
export class DealSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<DealVM> = new EventEmitter<DealVM>();
  @Output() useAdd: EventEmitter<string> = new EventEmitter<string>();
  @Input() selected: DealVM;
  @Input() forSearch = false;
  @Input() template: HTMLElement;
  value = '';
  deals: DealVM[] = [];
  filterDeals: DealVM[] = [];
  stage = 'finding';
  constructor(
    protected readonly dealService: DealService,
  ) { }

  ngOnInit() {
    this.dealService.findAll().subscribe((data) => {
      this.deals = data.filter((deal) => this.forSearch ? true : deal.status === 'processing');
      setTimeout(() => {
        this.stage = 'done';
        this.filterDeals = data.filter((deal) => this.forSearch ? true : deal.status === 'processing');
      }, 500);
    });
  }

  useChangeValue = (value: string) => {
    this.stage = 'finding';
    setTimeout(() => {
      this.value = value;
      this.filterDeals = this.deals.filter((deal) => deal.title.toLowerCase().includes(value.toLowerCase()));
      this.stage = 'done';
    }, 500);
  }
}
