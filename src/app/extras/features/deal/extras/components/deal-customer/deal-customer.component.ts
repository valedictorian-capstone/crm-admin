import { Component, Input } from '@angular/core';
import { DealService, GlobalService } from '@services';
import { DealVM, CustomerVM } from '@view-models';
import { tap, catchError, finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deal-customer',
  templateUrl: './deal-customer.component.html',
  styleUrls: ['./deal-customer.component.scss']
})
export class DealCustomerComponent {
  @Input() deal: DealVM;
  @Input() canUpdate: boolean;
  selectedCustomer: CustomerVM;
  show = true;
  showChange = false;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  useChange(customer: CustomerVM) {
    if (customer && customer.id !== this.deal.customer.id) {
      this.useShowSpinner();
      this.service.update({ id: this.deal.id, customer: { id: customer.id } } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change customer successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change customer fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.selectedCustomer = undefined;
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select another customer!', '', 'warning')
    }
  }
  usePhone(){
    window.open('tel:' + this.deal.customer.phone, '_self');
  }
  useMail(){
    this.globalService.triggerView$.next({ type: 'mail', payload: { email: this.deal.customer.email } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-customer');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-customer');
  }
}
