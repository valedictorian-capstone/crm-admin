import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { ProductService } from '@services';
import { ProductVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
@Component({
  selector: 'app-product-solve-check',
  templateUrl: './product-solve-check.component.html',
  styleUrls: ['./product-solve-check.component.scss']
})
export class ProductSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, product: ProductVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ProductService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected products?',
      text: 'When you click OK button, all selected products will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.removeMany(this.checkList.map((e) => e.product))
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove  all selected products successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove  all selected products fail! ' + err.message, { duration: 3000 });
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
