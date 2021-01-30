import { Component, Input } from '@angular/core';
import { DealService, GlobalService } from '@services';
import { DealVM, AccountVM } from '@view-models';
import { tap, catchError, finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deal-feedback-assignee',
  templateUrl: './deal-feedback-assignee.component.html',
  styleUrls: ['./deal-feedback-assignee.component.scss']
})
export class DealFeedbackAssigneeComponent {
  @Input() deal: DealVM;
  @Input() you: AccountVM;
  @Input() canAssign = false;
  @Input() canGetFeedback = false;
  selectedAccount: AccountVM;
  show = true;
  showChange = false;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) { }
  log = (v) => console.log(v);
  useChange(account: AccountVM) {
    if (account && account.id !== this.deal.feedbackAssignee.id) {
      this.useShowSpinner();
      this.service.update({ id: this.deal.id, feedbackAssignee: { id: account.id } } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change feedback assignee successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change feedback assignee fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.selectedAccount = undefined;
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select another feedback assignee!', '', 'warning')
    }
  }
  usePhone() {
    window.open('tel:' + this.deal.assignee.phone, '_self');
  }
  useMail() {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email: this.deal.assignee.email } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-feedbackAssignee');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-feedbackAssignee');
  }
}
