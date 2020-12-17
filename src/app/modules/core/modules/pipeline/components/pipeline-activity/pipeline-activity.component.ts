import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivityService, DealService, GlobalService } from '@services';
import { ActivityAction } from '@store/actions';
import { State } from '@store/states';
import { ActivityVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-activity',
  templateUrl: './pipeline-activity.component.html',
  styleUrls: ['./pipeline-activity.component.scss']
})
export class PipelineActivityComponent implements OnInit, OnDestroy {
  @Input() deal: DealVM;
  subscriptions: Subscription[] = [];
  activitys: (ActivityVM & { state: string })[] = [];
  constructor(
    protected readonly dealService: DealService,
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }

  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select((state) => state.activity)
        .pipe(
          tap((activity) => {
            const firstLoad = activity.firstLoad;
            const data = (activity.ids as string[]).map((id) => activity.entities[id]);
            if (!firstLoad) {
              this.useReload();
            } else {
              this.activitys =
                data.filter((activity) => activity.deal.id === this.deal.id).map((e) => ({
                  ...e,
                  state: new Date() < new Date(e.dateStart)
                    ? 'notStart'
                    : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired')
                }));
            }
          })
        ).subscribe()
    );
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
    this.spinner.show('pipeline-activity');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('pipeline-activity');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
