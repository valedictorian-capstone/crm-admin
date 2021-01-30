import { IActivityMainState, IActivitySearch } from '@extras/features/activity';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { ActivityService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ActivityAction } from '@store/actions';
import { CalendarView } from 'angular-calendar';
import { ActivityVM, CampaignVM, DealVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-activity-main',
  templateUrl: './activity-main.container.html',
  styleUrls: ['./activity-main.container.scss']
})
export class ActivityMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    key: string;
    id: string;
  };
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() isMain: boolean;
  @Input() for: 'deal' | 'campaign' = 'deal';
  checkList: {formControl: FormControl, activity: ActivityVM}[] = [];
  state: IActivityMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    pageCount: 20,
    active: new FormControl(1),
    show: true,
    type: 'datatable',

  }
  search: IActivitySearch = {
    types: [],
    name: '',
    range: undefined,
    deal: undefined,
    assignee: undefined,
    campaign: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  viewDate: Date = new Date();
  subType: 'day' | 'month' | 'week' = 'month';
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ActivityService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  ngOnChanges() {
    this.useCheckPermission();
  }
  useCheckPermission() {
    if (this.state.you) {
      if (this.deal || this.campaign) {
        if (this.deal) {
          this.state.canAdd = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0 && this.deal.status === 'processing';
          this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
          this.state.canRemove = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
        }
        if (this.campaign) {
          this.state.canAdd = this.state.you.roles.filter((role) => role.canUpdateCampaign).length > 0 && this.campaign.status === 'active';
          this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateCampaign).length > 0;
          this.state.canRemove = this.state.you.roles.filter((role) => role.canUpdateCampaign).length > 0;
        }
      } else {
        this.state.canAdd = true;
        this.state.canUpdate = true;
        this.state.canRemove = true;
      }
    }
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.useCheckPermission();
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.activity)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]);
            if (this.query) {
              rs = rs.filter((e) => e[this.query.key] && e[this.query.key].id === this.query.id);
            }
            if (!this.deal && !this.campaign) {
              if (this.state.you.roles.filter(role => role.canGetAllActivity).length === 0) {
                rs = rs.filter((e) => e.assignee.id === this.state.you.id || !e.assignee);
              }
            }
            if (firstLoad || this.state.firstLoad) {
              this.state.array = rs.map((e) => ({
                id: e.id,
                title: e.name,
                start: new Date(e.dateStart),
                state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired'),
                ...e,
              }));;
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
      this.store.dispatch(ActivityAction.FindAllAction({
        finalize: () => {
          this.useHideSpinner();
        }
      }));
    } else {
      this.subscriptions.push(
        this.service.query(this.query)
          .pipe(
            tap((res) => this.store.dispatch(ActivityAction.ListAction({ res }))),
            finalize(() => {
              this.state.firstLoad = true;
              setTimeout(() => {
                this.useHideSpinner();
              }, 1000);
            })
          )
          .subscribe()
      );
    }
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.name ? e.name.toLowerCase().includes(this.search.name.toLowerCase()) : true)
      && (this.search.assignee ? e.assignee?.id === this.search.assignee.id : true)
      && (this.search.deal ? e.deal?.id === this.search.deal.id : true)
      && (this.search.campaign ? e.campaign?.id === this.search.campaign.id : true)
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
    });
    this.state = { ...this.state };
  }
  useSearch = (search: IActivitySearch) => {
    this.search = search;
    this.useFilter();
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useShowSpinner = () => {
    this.spinner.show('activity-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('activity-main');
  }
  useCheck(checkList: {formControl: FormControl, activity: ActivityVM}[]) {
    this.checkList = checkList;
    console.log(this.checkList);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
