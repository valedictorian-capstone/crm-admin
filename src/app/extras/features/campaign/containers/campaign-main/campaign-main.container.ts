import { ICampaignMainState, ICampaignSearch } from '@extras/features/campaign';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { CampaignService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { CampaignAction } from '@store/actions';
import { FormControl } from '@angular/forms';
import { CampaignVM } from '@view-models';

@Component({
  selector: 'app-campaign-main',
  templateUrl: './campaign-main.container.html',
  styleUrls: ['./campaign-main.container.scss']
})
export class CampaignMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    key: string;
    id: string;
  };
  @Input() isMain: boolean;
  state: ICampaignMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: ICampaignSearch = {
    types: [],
    name: '',
    range: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  subscriptions: Subscription[] = [];
  checkList: { formControl: FormControl, campaign: CampaignVM }[] = [];
  constructor(
    protected readonly service: CampaignService,
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
              this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateCampaign).length > 0;
              this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCampaign).length > 0;
              this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveCampaign).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.campaign)
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
      this.store.dispatch(CampaignAction.FindAllAction({
        finalize: () => {
          this.useHideSpinner();
        }
      }));
    } else {
      this.service.query(this.query)
        .pipe(
          tap((res) => this.store.dispatch(CampaignAction.ListAction({ res }))),
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
      (this.search.name ? e.name.toLowerCase().includes(this.search.name.toLowerCase()) : true)
      && (this.search.types.length > 0 ? this.search.types.includes(e.type) : true)
      && (this.search.range
        ? (
          (this.search.range.start ? (e.dateStart && new Date(e.dateStart).getTime() >= new Date(this.search.range.start).getTime()) : true)
          &&
          (this.search.range.end ? (e.dateEnd && new Date(e.dateEnd).getTime() <= new Date(this.search.range.end).getTime()) : true))
        : true)
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
  useCheck(checkList: { formControl: FormControl, campaign: CampaignVM }[]) {
    this.checkList = checkList;
  }
  useSearch = (search: ICampaignSearch) => {
    this.search = search;
    console.log(this.search);
    this.useFilter();
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useShowSpinner = () => {
    this.spinner.show('campaign-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('campaign-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
