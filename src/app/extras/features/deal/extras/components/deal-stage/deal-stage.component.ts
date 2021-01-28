import { Component, OnInit, Input } from '@angular/core';
import { DealService } from '@services';
import { DealVM, PipelineVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { finalize, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-deal-stage',
  templateUrl: './deal-stage.component.html',
  styleUrls: ['./deal-stage.component.scss']
})
export class DealStageComponent {
  @Input() deal: DealVM;
  @Input() selectedStage: StageVM;
  @Input() selectedPipeline: PipelineVM;
  show = true;
  showChange = false;
  constructor(
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  useChange(stage: StageVM) {
    if (stage && stage.id !== this.deal.stage.id) {
      this.useShowSpinner();
      this.service.update({ id: this.deal.id, stage: { id: stage.id } } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change stage successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change stage fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.selectedStage = undefined;
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select another stage!', '', 'warning')
    }
  }
  useSelectPipeline = async (selected: PipelineVM) => {
    if (this.deal.stage.pipeline.id !== selected.id) {
      this.selectedPipeline = selected;
      this.selectedStage = selected.stages.find((stage) => stage.position === 0);
    } else {
      this.selectedStage = this.deal.stage;
    }
  }
  useShowSpinner = () => {
    this.spinner.show('deal-stage');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-stage');
  }
}
