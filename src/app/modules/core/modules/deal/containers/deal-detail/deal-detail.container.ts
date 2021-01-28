import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DealService } from '@services';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { tap, pluck, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { authSelector } from '@store/selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { DealAction } from '@actions';
import { IDealDetailState } from '@extras/features/deal';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.container.html',
  styleUrls: ['./deal-detail.container.scss']
})
export class DealDetailContainer implements OnInit, OnDestroy {
  state: IDealDetailState = {
    id: undefined,
    main: undefined,
    you: undefined
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useGetId();
    this.useLoadMine();
  }

  ngOnInit() {
    this.useDispatch();
  }
  useGetId() {
    this.subscriptions.push(
      this.activatedRoute.params
        .pipe(
          pluck('id'),
          tap((id) => {
            this.state.id = id;
            this.useReload();
          })
        ).subscribe()
    );
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
              this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignDeal).length > 0;
              this.state.canGetAssign = this.state.you.roles.filter((role) => role.canGetAssignDeal).length > 0;
              this.state.canGetFeedback = this.state.you.roles.filter((role) => role.canGetFeedbackDeal).length > 0;
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
            const dataFind = data.entities ? data.entities[this.state.id] : undefined;
            if (!dataFind) {
              this.useReload();
            } else {
              this.state.main = dataFind;
            }
          })
        ).subscribe()
    );
  }
  useReload() {
    this.useShowSpinner();
    this.service.findById(this.state.id)
      .pipe(
        tap((res) => this.store.dispatch(DealAction.SaveSuccessAction({ res }))),
        finalize(() => this.useHideSpinner())
      )
      .subscribe()
  }
  useShowSpinner = () => {
    this.spinner.show('deal-detail');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-detail');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
