import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DealService } from '@services';
import { DealVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-reuse-deal-item',
  templateUrl: './deal-item.component.html',
  styleUrls: ['./deal-item.component.scss']
})
export class DealItemComponent implements OnInit, OnDestroy {
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Input() deal: DealVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly router: Router,
  ) { }

  ngOnInit() {
    this.useReload();
  }
  useReload = () => {
    const subscription = this.service.findById(this.deal.id)
      .pipe(
        tap((data) => {
          this.deal = data;
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDetail = () => {
    this.router.navigate(['core/deal/' + this.deal.id]);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
