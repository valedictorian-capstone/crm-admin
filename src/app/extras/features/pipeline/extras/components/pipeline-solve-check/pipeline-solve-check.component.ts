import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pipeline-solve-check',
  templateUrl: './pipeline-solve-check.component.html',
  styleUrls: ['./pipeline-solve-check.component.scss']
})
export class PipelineSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, pipeline: PipelineVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: PipelineService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected processs?',
      text: 'When you click OK button, all selected processs will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.removeMany(this.checkList.map((e) => e.process))
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove  all selected processs successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove  all selected processs fail! ' + err.message, { duration: 3000 });
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
