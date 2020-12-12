import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { DealService, ActivityService, GlobalService } from '@services';
import { ActivityAction } from '@store/actions';
import { activitySelector } from '@store/selectors';
import { State } from '@store/states';
import { DealVM, ActivityVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-deal-item-activity',
  templateUrl: './deal-item-activity.component.html',
  styleUrls: ['./deal-item-activity.component.scss']
})
export class DealItemActivityComponent implements OnInit, OnDestroy {
  @Input() deal: DealVM;
  activitys: (ActivityVM & { state: string })[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly dealService: DealService,
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useShowSpinner();
  }

  ngOnInit() {
    // this.activityService.triggerSocket().subscribe((trigger) => {
    //   if (trigger.type === 'create') {
    //     this.activitys.push({
    //       ...(trigger.data as ActivityVM),
    //       state: new Date() < new Date((trigger.data as ActivityVM).dateStart)
    //         ? 'notStart'
    //         : (new Date() >= new Date((trigger.data as ActivityVM).dateStart) && new Date() < new Date((trigger.data as ActivityVM).dateEnd) ? 'processing' : 'expired')
    //     });
    //   } else if (trigger.type === 'update') {
    //     this.activitys[this.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id)] = {
    //       ...(trigger.data as ActivityVM),
    //       state: new Date() < new Date((trigger.data as ActivityVM).dateStart)
    //         ? 'notStart'
    //         : (new Date() >= new Date((trigger.data as ActivityVM).dateStart) && new Date() < new Date((trigger.data as ActivityVM).dateEnd) ? 'processing' : 'expired')
    //     };
    //   } else if (trigger.type === 'remove') {
    //     this.activitys.splice(this.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id), 1);
    //   }
    // });
    // this.dealService.findById(this.deal.id)
    //   .pipe(
    //     finalize(() => {
    //       this.useHideSpinner();
    //     })
    //   )
    //   .subscribe((data) => this.activitys =
    //     data.activitys.map((e) => ({
    //       ...e,
    //       state: new Date() < new Date(e.dateStart)
    //         ? 'notStart'
    //         : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired')
    //     })));
    this.useDispatch();
    this.useData();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(activitySelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.useReload();
            }
          })
        ).subscribe()
    );
  }
  useData = () => {
    this.subscriptions.push(
      this.store.select(activitySelector.activitys)
        .pipe(
          tap((data) => {
            this.activitys =
              data.filter((activity) => activity.deal.id === this.deal.id).map((e) => ({
                ...e,
                state: new Date() < new Date(e.dateStart)
                  ? 'notStart'
                  : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired')
              }));
          })
        ).subscribe());
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(ActivityAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { deal: this.deal, fixDeal: true } });
  }
  useEdit = (activity: ActivityVM) => {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: { ...activity, deal: this.deal } } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-item-activity');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('deal-item-activity');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
