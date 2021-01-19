import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CampaignService } from '@services';
import { CampaignVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
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
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected campaigns?',
      text: 'When you click OK button, all selected campaigns will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.removeMany(this.checkList.map((e) => e.campaign))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove  all selected campaigns successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove  all selected campaigns fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
