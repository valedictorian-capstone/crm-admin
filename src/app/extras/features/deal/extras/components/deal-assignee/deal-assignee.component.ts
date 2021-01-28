import { Component, Input } from '@angular/core';
import { DealService, GlobalService } from '@services';
import { DealVM, AccountVM } from '@view-models';
import { tap, catchError, finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deal-assignee',
  templateUrl: './deal-assignee.component.html',
  styleUrls: ['./deal-assignee.component.scss']
})
export class DealAssigneeComponent {
  @Input() deal: DealVM;
  @Input() you: AccountVM;
  @Input() canAssign = false;
  @Input() canGetAssign = false;
  selectedAccount: AccountVM;
  show = true;
  showChange = false;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  useChange(account: AccountVM) {
    if (account && account.id !== this.deal.assignee.id) {
      this.useShowSpinner();
      this.service.update({ id: this.deal.id, assignee: { id: account.id } } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change assignee successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change assignee fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.selectedAccount = undefined;
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select another assignee!', '', 'warning')
    }
  }
  usePhone(){
    window.open('tel:' + this.deal.assignee.phone, '_self');
  }
  useMail(){
    this.globalService.triggerView$.next({ type: 'mail', payload: { email: this.deal.assignee.email } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-assignee');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-assignee');
  }
}
