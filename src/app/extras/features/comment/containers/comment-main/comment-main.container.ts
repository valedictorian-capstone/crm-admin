import { ICommentMainState, ICommentSearch } from '@extras/features/comment';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISort } from '@extras/interfaces';
import { Store } from '@ngrx/store';
import { CommentService } from '@services';
import { State } from '@states';
import { authSelector } from '@selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { CommentAction } from '@store/actions';
import { CampaignVM, DealVM, CommentVM } from '@view-models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-comment-main',
  templateUrl: './comment-main.container.html',
  styleUrls: ['./comment-main.container.scss']
})
export class CommentMainContainer implements OnInit {
  @Input() id: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() isMain: boolean;
  @Input() for: 'deal' | 'campaign' = 'deal';
  state: ICommentMainState = {
    array: [],
    filterArray: [],
    paginationArray: [],
    active: new FormControl(1),
    pageCount: 20,
    show: true,
    type: 'card',
  }
  search: ICommentSearch = {
    customer: undefined,
    range: undefined,
  }
  sort: ISort = {
    key: undefined,
    stage: 'up',
  };
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CommentService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch() {
    this.subscriptions.push(
      this.store.select((state) => state.comment)
        .pipe(
          tap((data) => {
            const firstLoad = data.firstLoad;
            let rs = (data.ids as string[]).map((id) => data.entities[id]).filter((e) => e.product.id === this.id);
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
    this.service.findByProductId(this.id)
      .pipe(
        tap((res) => this.store.dispatch(CommentAction.ListAction({ res }))),
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
    this.state.filterArray = this.state.array;
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
  useSearch = (search: ICommentSearch) => {
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
    this.spinner.show('comment-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('comment-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
