import { Component, OnInit, Input } from '@angular/core';
import { CampaignService } from '@services';
import { CampaignVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, Validators } from '@angular/forms';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-campaign-process',
  templateUrl: './campaign-process.component.html',
  styleUrls: ['./campaign-process.component.scss']
})
export class CampaignProcessComponent {
  @Input() campaign: CampaignVM;
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
      this.service.update({ id: this.campaign.id, pipeline: { id: this.control.value.id } } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change process successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change process fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.control.setValue(undefined);
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select process!', '', 'warning')
    }
  }
  useShowSpinner = () => {
    this.spinner.show('campaign-process');
  }
  useHideSpinner = () => {
    this.spinner.hide('campaign-process');
  }
}
