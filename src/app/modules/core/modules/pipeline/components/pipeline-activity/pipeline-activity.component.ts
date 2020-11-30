import { Component, Input, OnInit } from '@angular/core';
import { ActivityService, DealService, GlobalService } from '@services';
import { ActivityVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-activity',
  templateUrl: './pipeline-activity.component.html',
  styleUrls: ['./pipeline-activity.component.scss']
})
export class PipelineActivityComponent implements OnInit {
  @Input() deal: DealVM;
  activitys: (ActivityVM & { state: string })[] = [];
  constructor(
    protected readonly dealService: DealService,
    protected readonly activityService: ActivityService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
   }

  ngOnInit() {
    this.activityService.triggerValue$.subscribe((trigger) => {
      if (trigger.type === 'create') {
        this.activitys.push({
          ...trigger.data,
          state: new Date() < new Date(trigger.data.dateStart)
          ? 'notStart'
          : (new Date() >= new Date(trigger.data.dateStart) && new Date() < new Date(trigger.data.dateEnd) ? 'processing' : 'expired')
        });
      } else if (trigger.type === 'update') {
        this.activitys[this.activitys.findIndex((e) => e.id === trigger.data.id)] = {
          ...trigger.data,
          state: new Date() < new Date(trigger.data.dateStart)
          ? 'notStart'
          : (new Date() >= new Date(trigger.data.dateStart) && new Date() < new Date(trigger.data.dateEnd) ? 'processing' : 'expired')
        };
      } else {
        this.activitys = this.activitys.filter((activity) => activity.id !== trigger.data.id);
      }
    });
    this.dealService.findById(this.deal.id)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => this.activitys =
        data.activitys.map((e) => ({
          ...e,
          state: new Date() < new Date(e.dateStart)
            ? 'notStart'
            : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired')
        })));
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
}
