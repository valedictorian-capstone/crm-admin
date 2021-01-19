import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { AttachmentService } from '@services';
import { AttachmentVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-attachment-solve-check',
  templateUrl: './attachment-solve-check.component.html',
  styleUrls: ['./attachment-solve-check.component.scss']
})
export class AttachmentSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, attachment: AttachmentVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AttachmentService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected attachments?',
      text: 'When you click OK button, all selected attachments will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.removeMany(this.checkList.map((e) => e.attachment))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove  all selected attachments successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove  all selected attachments fail! ' + err.message, { duration: 3000 });
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
