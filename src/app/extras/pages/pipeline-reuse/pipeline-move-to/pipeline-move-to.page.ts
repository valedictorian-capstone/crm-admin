import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { PipelineService } from '@services';
import { StageVM, PipelineVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-pipeline-move-to',
  templateUrl: './pipeline-move-to.page.html',
  styleUrls: ['./pipeline-move-to.page.scss']
})
export class PipelineMovetoPage implements OnInit, OnChanges {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<StageVM> = new EventEmitter<StageVM>();
  @Input() deal: DealVM;
  @Input() inside = false;
  selectedStage: StageVM;
  pipeline: PipelineVM;
  pipelines: PipelineVM[] = [];
  loading = true;
  constructor(
    protected readonly pipelineService: PipelineService,
    protected readonly spinner: NgxSpinnerService
  ) { }
  ngOnInit() {
    this.selectedStage = this.deal.stage;
    this.useInit();
  }
  ngOnChanges() {
    this.selectedStage = this.deal.stage;
    this.useInit();
  }
  useInit = () => {
    this.useShowSpinner();
    this.pipelineService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        if (!this.pipeline) {
          this.pipelines = data.filter((pipeline) => !pipeline.isDelete);
          const selectedPipeline = localStorage.getItem('selectedPipeline');
          this.useSelectPipeline(selectedPipeline, this.selectedStage);
        } else {
          this.pipelines = data.filter((pipeline) => pipeline.id === this.pipeline.id
          || (pipeline.id !== this.pipeline.id && !pipeline.isDelete));
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

  useShowSpinner = () => {
    this.spinner.show('pipeline-move-to');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('pipeline-move-to');
    }, 1000);
  }
}
