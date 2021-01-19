import { ILogMainState, ILogSearch } from '@extras/features/log';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { LogService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LogAction } from '@store/actions';
import { CampaignVM, DealVM, LogVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-log-main',
  templateUrl: './log-main.container.html',
  styleUrls: ['./log-main.container.scss']
})
export class LogMainContainer implements OnInit, OnDestroy {
  @Input() query: {
    key: string;
    id: string;
  };
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() isMain: boolean;
  @Input() for: 'deal' | 'campaign' = 'deal';
  state: ILogMainState = {
    array: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'datatable',
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  checkList: {formControl: FormControl, log: LogVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: LogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.log)
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
        tap((res) => this.store.dispatch(LogAction.ListAction({ res }))),
        finalize(() => {
          this.state.firstLoad = true;
          setTimeout(() => {
            this.useHideSpinner();
          }, 1000);
        })
      )
      .subscribe()
  }
  useSort = () => {
    if (this.sort.key) {
      this.state.array.sort((a, b) => a[this.sort.key] < b[this.sort.key] ? (this.sort.stage === 'down' ? -1 : 1) : (this.sort.stage === 'down' ? 1 : -1));
    }
    this.usePagination();
  }
  useFilter = () => {
    this.useCalculateMax();
    this.state.active.setValue(1);
    this.useSort();
  }
  useCalculateMax() {
    if (this.state.array.length > this.state.pageCount) {
      this.state.max = Math.floor(this.state.array.length / this.state.pageCount) + (this.state.array.length % this.state.pageCount > 0 ? 1 : 0);
    } else {
      this.state.max = 1;
    }
  }
  usePagination = () => {
    this.state.paginationArray = this.state.array.filter((e, i) => {
      i = i + 1;
      const page = this.state.active.value * this.state.pageCount;
      return i >= page - (this.state.pageCount - 1) && i <= page;
    })
    this.state = { ...this.state };
  }
  useCheck(checkList: {formControl: FormControl, log: LogVM}[]) {
    this.checkList = checkList;
  }
  useShowSpinner = () => {
    this.spinner.show('log-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('log-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
