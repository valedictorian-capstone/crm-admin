import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { LogService } from '@services';
import { LogVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-log-solve-check',
  templateUrl: './log-solve-check.component.html',
  styleUrls: ['./log-solve-check.component.scss']
})
export class LogSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, log: LogVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: LogService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected logs?',
      text: 'When you click OK button, all selected logs will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.removeMany(this.checkList.map((e) => e.log))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove  all selected logs successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove  all selected logs fail! ' + err.message, { duration: 3000 });
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
