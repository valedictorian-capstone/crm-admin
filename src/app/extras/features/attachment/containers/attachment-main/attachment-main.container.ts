import { IAttachmentMainState, IAttachmentSearch } from '@extras/features/attachment';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { AttachmentService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { AttachmentAction } from '@store/actions';
import { AttachmentVM, CampaignVM, DealVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-attachment-main',
  templateUrl: './attachment-main.container.html',
  styleUrls: ['./attachment-main.container.scss']
})
export class AttachmentMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    key: string;
    id: string;
  };
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() isMain: boolean;
  @Input() for: 'deal' | 'campaign';
  checkList: {formControl: FormControl, attachment: AttachmentVM}[] = [];
  state: IAttachmentMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  search: IAttachmentSearch = {
    name: '',
    deal: undefined,
    campaign: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AttachmentService,
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
      this.store.select((state) => state.attachment)
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
    this.service.query(this.query)
      .pipe(
        tap((res) => this.store.dispatch(AttachmentAction.ListAction({ res }))),
        finalize(() => {
          this.state.firstLoad = true;
          this.useHideSpinner();
        })
      )
      .subscribe()
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.name ? e.name.toLowerCase().includes(this.search.name.toLowerCase()) : true)
      && (this.search.deal ? e.deal?.id === this.search.deal.id : true)
      && (this.search.campaign ? e.campaign?.id === this.search.campaign.id : true)
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
  useSearch = (search: IAttachmentSearch) => {
    this.search = search;
    this.useFilter();
  }
  useCheck(checkList: {formControl: FormControl, attachment: AttachmentVM}[]) {
    this.checkList = checkList;
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.filterArray.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();

  }
  useShowSpinner = () => {
    this.spinner.show('attachment-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('attachment-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
