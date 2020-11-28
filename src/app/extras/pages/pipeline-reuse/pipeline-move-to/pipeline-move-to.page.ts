import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PipelineService } from '@services';
import { StageVM, PipelineVM, DealVM } from '@view-models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-pipeline-move-to',
  templateUrl: './pipeline-move-to.page.html',
  styleUrls: ['./pipeline-move-to.page.scss']
})
export class PipelineMovetoPage implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<StageVM> = new EventEmitter<StageVM>();
  @Input() deal: DealVM;
  @Input() inside = false;
  selectedStage: StageVM;
  pipeline: PipelineVM;
  pipelines: PipelineVM[] = [];
  loading = true;
  constructor(
    protected readonly pipelineService: PipelineService
  ) { }
  ngOnInit() {
    this.selectedStage = this.deal.stage;
    this.useInit();
  }
  useInit = () => {
    this.pipelineService.findAll()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data) => {
        this.pipelines = data;
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
