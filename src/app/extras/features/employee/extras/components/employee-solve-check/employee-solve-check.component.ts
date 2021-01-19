import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { AccountService } from '@services';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-employee-solve-check',
  templateUrl: './employee-solve-check.component.html',
  styleUrls: ['./employee-solve-check.component.scss']
})
export class EmployeeSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, employee: AccountVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AccountService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected employees?',
      text: 'When you click OK button, all selected employees will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.removeMany(this.checkList.map((e) => e.employee))
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove  all selected employees successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove  all selected employees fail! ' + err.message, { duration: 3000 });
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
