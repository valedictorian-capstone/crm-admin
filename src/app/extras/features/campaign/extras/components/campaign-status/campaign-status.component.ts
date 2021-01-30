import { Component, OnInit, Input } from '@angular/core';
import { CampaignService } from '@services';
import { CampaignVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, Validators } from '@angular/forms';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-campaign-status',
  templateUrl: './campaign-status.component.html',
  styleUrls: ['./campaign-status.component.scss']
})
export class CampaignStatusComponent {
  @Input() campaign: CampaignVM;
  @Input() canUpdate: boolean;
  control = new FormControl(undefined, [Validators.required]);
  show = true;
  showChange = false;
  constructor(
    protected readonly service: CampaignService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  useChange() {
    if (this.control.valid) {
      this.useShowSpinner();
      this.service.update({ id: this.campaign.id, status: this.control.value } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change status successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change status fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.control.setValue(undefined);
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select status!', '', 'warning')
    }
  }
  useShowSpinner = () => {
    this.spinner.show('campaign-status');
  }
  useHideSpinner = () => {
    this.spinner.hide('campaign-status');
  }
  useCheckPlanning() {
    return this.campaign.status === 'inactive' && (new Date() < new Date(this.campaign.dateStart));
  }
  useCheckActive() {
    return this.campaign.status === 'inactive' && (new Date() >= new Date(this.campaign.dateStart)) && (new Date() >= new Date(this.campaign.dateEnd));
  }
  useCheckInactive() {
    return this.campaign.status !== 'inactive' && this.campaign.status !== 'complete';
  }
  useCheckChange() {
    return this.campaign.status !== 'complete' || this.useCheckActive();
  }
}
