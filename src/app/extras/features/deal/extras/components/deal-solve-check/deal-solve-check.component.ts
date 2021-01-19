import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { DealService } from '@services';
import { DealVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-deal-solve-check',
  templateUrl: './deal-solve-check.component.html',
  styleUrls: ['./deal-solve-check.component.scss']
})
export class DealSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, deal: DealVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected deals?',
      text: 'When you click OK button, all selected deals will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.removeMany(this.checkList.map((e) => e.deal))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove  all selected deals successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove  all selected deals fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  useAssign() {

  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
