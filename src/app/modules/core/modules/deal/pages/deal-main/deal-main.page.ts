import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, DealService, GlobalService } from '@services';
import { DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deal-main',
  templateUrl: './deal-main.page.html',
  styleUrls: ['./deal-main.page.scss']
})
export class DealMainPage implements OnInit {
  deals: DealVM[] = [];
  filterDeals: DealVM[] = [];
  status = '';
  canAdd = false;
  canUpdate = false;
  canRemove = false;
  constructor(
    protected readonly router: Router,
    protected readonly dealService: DealService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.useLoadMine();
    this.useReload();
    this.useSocket();
  }
  useSocket = () => {
    this.dealService.triggerSocket().subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.deals.push((trigger.data as DealVM));
      } else if (trigger.type === 'update') {
        this.deals[this.deals.findIndex((e) => e.id === (trigger.data as DealVM).id)] = (trigger.data as DealVM);
      } else if (trigger.type === 'remove') {
        this.deals.splice(this.deals.findIndex((e) => e.id === (trigger.data as DealVM).id), 1);
      }
      this.useFilter();
    });
  }
  useReload = () => {
    this.useShowSpinner();
    this.dealService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        }),
      )
      .subscribe(async (data) => {
        this.deals = data;
        this.useFilter();
      });
  }
  useLoadMine = () => {
    this.authService.auth(undefined).subscribe((data) => {
      this.canAdd = data.roles.filter((role) => role.canCreateCustomer).length > 0;
      this.canUpdate = data.roles.filter((role) => role.canUpdateCustomer).length > 0;
      this.canRemove = data.roles.filter((role) => role.canRemoveCustomer).length > 0;
    });
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: {} });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-list');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('deal-list');
    }, 1000);
  }
  useViewPipeline = () => {
    this.router.navigate(['core/process/detail']);
  }
  useFilter = () => {
    this.filterDeals = this.deals.filter((deal) => deal.status.includes(this.status));
  }
}
