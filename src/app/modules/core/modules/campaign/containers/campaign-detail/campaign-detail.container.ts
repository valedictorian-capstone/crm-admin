import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '@services';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { tap, pluck, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { authSelector } from '@store/selectors';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignAction } from '@actions';
import { ICampaignDetailState } from '@extras/features/campaign';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.container.html',
  styleUrls: ['./campaign-detail.container.scss']
})
export class CampaignDetailContainer implements OnInit, OnDestroy {
  state: ICampaignDetailState = {
    id: undefined,
    main: undefined,
    you: undefined
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CampaignService,
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
              // this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateDeal).length > 0;
              // this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
              // this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveDeal).length > 0;
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
        tap((res) => this.store.dispatch(CampaignAction.SaveSuccessAction({ res }))),
        finalize(() => this.useHideSpinner())
      )
      .subscribe()
  }
  useShowSpinner = () => {
    this.spinner.show('campaign-detail');
  }
  useHideSpinner = () => {
    this.spinner.hide('campaign-detail');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
