import { INoteMainState, INoteSearch } from '@extras/features/note';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { NoteService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { NoteAction } from '@store/actions';
import { CampaignVM, DealVM, NoteVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-note-main',
  templateUrl: './note-main.container.html',
  styleUrls: ['./note-main.container.scss']
})
export class NoteMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    key: string;
    id: string;
  };
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() isMain: boolean;
  @Input() for: 'deal' | 'campaign' = 'deal';
  state: INoteMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'card',
  }
  search: INoteSearch = {
    deal: undefined,
    campaign: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: {formControl: FormControl, note: NoteVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: NoteService,
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
      this.store.select((state) => state.note)
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
  useCheck(checkList: {formControl: FormControl, note: NoteVM}[]) {
    this.checkList = checkList;
  }
  useReload() {
    this.useShowSpinner();
    this.service.query(this.query)
      .pipe(
        tap((res) => this.store.dispatch(NoteAction.ListAction({ res }))),
        finalize(() => {
          this.state.firstLoad = true;
          setTimeout(() => {
            this.useHideSpinner();
          }, 1000);
        })
      )
      .subscribe()
  }
  useFilter = () => {
    this.state.filterArray = this.state.array.filter((e) =>
      (this.search.deal ? e.deal?.id === this.search.deal.id : true)
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
  useSearch = (search: INoteSearch) => {
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
    this.spinner.show('note-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('note-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
