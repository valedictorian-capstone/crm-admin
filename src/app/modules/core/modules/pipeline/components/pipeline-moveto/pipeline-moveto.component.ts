import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PipelineService } from '@services';
import { StageVM, PipelineVM, DealVM } from '@view-models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-moveto',
  templateUrl: './pipeline-moveto.component.html',
  styleUrls: ['./pipeline-moveto.component.scss']
})
export class PipelineMovetoComponent implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<StageVM> = new EventEmitter<StageVM>();
  @Input() deal: DealVM;
  selectedStage: StageVM;
  pipeline: PipelineVM;
  pipelines: PipelineVM[] = [];
  loading = true;
  constructor(
    protected readonly pipelineService: PipelineService
  ) { }
  ngOnInit() {
    this.selectedStage = this.deal.stage;
    this.pipelineService.findAll()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data) => {
        this.pipelines = data.filter((pipeline) => !pipeline.isDelete);
        if (!this.pipeline) {
          const selectedPipeline = localStorage.getItem('selectedPipeline');
          this.useSelectPipeline(selectedPipeline, this.selectedStage);
        } else {
          if (!this.selectedStage) {
            this.selectedStage = this.pipeline.stages[0];
          }
        }
      });
  }
  useSelectPipeline = async (selected: string, stage?: StageVM) => {
    if (selected !== this.pipeline?.id) {
      this.pipeline = await this.pipelineService.findById(selected).toPromise();
      this.selectedStage = stage ? stage : this.pipeline.stages[0];
    }
  }

}
