import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
@Component({
  selector: 'app-customer-solve-check',
  templateUrl: './customer-solve-check.component.html',
  styleUrls: ['./customer-solve-check.component.scss']
})
export class CustomerSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, customer: CustomerVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CustomerService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected customers?',
      text: 'When you click OK button, all selected customers will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.removeMany(this.checkList.map((e) => e.customer))
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove  all selected customers successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove  all selected customers fail! ' + err.message, { duration: 3000 });
    //         return of(undefined);
    //       })
    //     ).subscribe(console.log);
    //   this.subscriptions.push(subscription);
    // }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
