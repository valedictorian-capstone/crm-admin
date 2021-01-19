import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { CategoryService } from '@services';
import { CategoryVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
@Component({
  selector: 'app-category-solve-check',
  templateUrl: './category-solve-check.component.html',
  styleUrls: ['./category-solve-check.component.scss']
})
export class CategorySolveCheckComponent {
  @Input() checkList: {formControl: FormControl, category: CategoryVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CategoryService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected categorys?',
      text: 'When you click OK button, all selected categorys will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.removeMany(this.checkList.map((e) => e.category))
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove  all selected categorys successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove  all selected categorys fail! ' + err.message, { duration: 3000 });
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
