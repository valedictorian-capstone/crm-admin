import { Component, Input } from '@angular/core';
import { DealService } from '@services';
import { DealVM, DealDetailVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-deal-feedback',
  templateUrl: './deal-feedback.component.html',
  styleUrls: ['./deal-feedback.component.scss']
})
export class DealFeedbackComponent {
  @Input() deal: DealVM;
  @Input() canUpdateFeedback: boolean;
  show = true;
  showChange = false;
  feedbackMessage = new FormControl('');
  feedbackRating = new FormControl(1);
  feedbackAssigneeRating = new FormControl(1);
  constructor(
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) { }
  ngOnInit() {
    this.useReset();
  }
  useReset() {
    this.feedbackMessage.setValue(this.deal.feedbackMessage);
    this.feedbackRating.setValue(this.deal.feedbackRating);
    this.feedbackAssigneeRating.setValue(this.deal.feedbackAssigneeRating);
  }
  useChange() {
    this.useShowSpinner();
    this.service.update({
      id: this.deal.id,
      feedbackMessage: this.feedbackMessage.value,
      feedbackRating: this.feedbackRating.value,
      feedbackAssigneeRating: this.feedbackAssigneeRating.value,
      feedbackStatus: 'resolve'
    } as any)
      .pipe(
        tap((data) => {
          swal.fire('Change feedback successful!', '', 'success');
        }),
        catchError((err) => {
          swal.fire('Change feedback fail!', 'Error: ' + err.message, 'error');
          return of(undefined);
        }),
        finalize(() => {
          this.showChange = false;
          this.useHideSpinner();
        })
      ).subscribe();
  }
  useShowSpinner = () => {
    this.spinner.show('deal-feedback');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-feedback');
  }
}
