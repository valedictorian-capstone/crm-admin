import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CampaignService } from '@services';
import { CampaignVM } from '@view-models';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-campaign-solve-check',
  templateUrl: './campaign-solve-check.component.html',
  styleUrls: ['./campaign-solve-check.component.scss']
})
export class CampaignSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, campaign: CampaignVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CampaignService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
