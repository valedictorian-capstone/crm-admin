import { Component, Input, OnInit } from '@angular/core';
import { IDealMainState, IDealSearch } from '@extras/features/deal';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { authSelector } from '@selectors';
import { DealService } from '@services';
import { State } from '@states';
import { DealAction } from '@store/actions';
import { CampaignVM, DealVM, PipelineVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-deal-main',
  templateUrl: './deal-main.container.html',
  styleUrls: ['./deal-main.container.scss']
})
export class DealMainContainer implements OnInit {
  @Input() query: {
    key: string;
    id: string;
  };
  @Input() isMain: boolean;
  @Input() for: 'basic' | 'campaign' = 'basic';
  @Input() campaign: CampaignVM;
  @Input() pipeline: PipelineVM;
  state: IDealMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: IDealSearch = {
    statuss: [],
    title: '',
    customer: undefined,
    assignee: undefined,
    campaign: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: { formControl: FormControl, deal: DealVM }[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateDeal).length > 0;
              this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
              this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveDeal).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.deal)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]);
            if (this.query) {
              rs = rs.filter((e) => e[this.query.key] && e[this.query.key].id === this.query.id);
            }
            if (firstLoad || this.state.firstLoad) {
              this.state.array = rs;
              this.useFilter();
            } else {
              this.useReload();
            }
          }),
        ).subscribe()
    );
  }
  useReload() {
    this.useShowSpinner();
    if (this.isMain) {
      this.store.dispatch(DealAction.FindAllAction({
        finalize: () => {
          this.useHideSpinner();
        }
      }));
    } else {
      this.service.query(this.query)
        .pipe(
          tap((res) => this.store.dispatch(DealAction.ListAction({ res }))),
          finalize(() => {
            this.state.firstLoad = true;
            this.useHideSpinner();
          })
        )
        .subscribe()
    }
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.title ? e.title.toLowerCase().includes(this.search.title.toLowerCase()) : true)
      && (this.search.assignee ? (this.search.assignee.id === 'None' ? !e.assignee : e.assignee?.id === this.search.assignee.id) : true)
      && (this.search.customer ? e.customer?.id === this.search.customer.id : true)
      && (this.search.campaign ? e.campaign?.id === this.search.campaign.id : true)
      && (this.search.statuss.length > 0 ? this.search.statuss.includes(e.status) : true)
    );
    this.useCalculateMax();
    this.state.active.setValue(1);
    this.useSort();
  }
  useCalculateMax() {
    if (this.state.filterArray.length > this.state.pageCount) {
      this.state.max = Math.floor(this.state.filterArray.length / this.state.pageCount) + (this.state.filterArray.length % this.state.pageCount > 0 ? 1 : 0);
    } else {
      this.state.max = 1;
    }
  }
  usePagination = () => {
    this.state.paginationArray = this.state.filterArray.filter((e, i) => {
      i = i + 1;
      const page = this.state.active.value * this.state.pageCount;
      return i >= page - (this.state.pageCount - 1) && i <= page;
    })
    this.state = { ...this.state };
  }
  useSearch = (search: IDealSearch) => {
    this.search = search;
    this.useFilter();
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useCheck(checkList: {formControl: FormControl, deal: DealVM}[]) {
    this.checkList = checkList;
  }
  useShowSpinner = () => {
    this.spinner.show('deal-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
