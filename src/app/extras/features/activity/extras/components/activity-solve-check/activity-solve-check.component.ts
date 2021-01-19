import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { ActivityService } from '@services';
import { ActivityVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-activity-solve-check',
  templateUrl: './activity-solve-check.component.html',
  styleUrls: ['./activity-solve-check.component.scss']
})
export class ActivitySolveCheckComponent {
  @Input() checkList: {formControl: FormControl, activity: ActivityVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: ActivityService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected activities?',
      text: 'When you click OK button, all selected activities will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.removeMany(this.checkList.map((e) => e.activity))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove  all selected activities successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove  all selected activities fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
