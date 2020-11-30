import { Component, Input, OnInit } from '@angular/core';
import { DealService, ActivityService, GlobalService } from '@services';
import { DealVM, ActivityVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deal-item-activity',
  templateUrl: './deal-item-activity.component.html',
  styleUrls: ['./deal-item-activity.component.scss']
})
export class DealItemActivityComponent implements OnInit {
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
        this.activitys.splice(this.activitys.findIndex((e) => e.id === trigger.data.id), 1);
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
    this.spinner.show('deal-item-activity');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('deal-item-activity');
    }, 1000);
  }

}
