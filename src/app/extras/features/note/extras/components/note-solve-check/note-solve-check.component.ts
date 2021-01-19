import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { NoteService } from '@services';
import { NoteVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-note-solve-check',
  templateUrl: './note-solve-check.component.html',
  styleUrls: ['./note-solve-check.component.scss']
})
export class NoteSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, note: NoteVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: NoteService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected notes?',
      text: 'When you click OK button, all selected notes will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.removeMany(this.checkList.map((e) => e.note))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove  all selected notes successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove  all selected notes fail! ' + err.message, { duration: 3000 });
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
