import { Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { PipelineService } from '@services';
import { PipelineAction } from '@store/actions';
import { pipelineSelector } from '@store/selectors';
import { State } from '@store/states';
import { StageVM, PipelineVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

interface IPipelineMovetoPageState {
  selectedStage: StageVM;
  pipeline: PipelineVM;
  realPipelines: PipelineVM[];
  pipelines: PipelineVM[];
  loading: boolean;
}
@Component({
  selector: 'app-reuse-pipeline-move-to',
  templateUrl: './pipeline-move-to.page.html',
  styleUrls: ['./pipeline-move-to.page.scss']
})
export class PipelineMovetoPage implements OnInit, OnChanges, OnDestroy {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<StageVM> = new EventEmitter<StageVM>();
  @Input() payload: { deal: DealVM, inside: boolean } = {
    deal: undefined,
    inside: false
  };
  subscriptions: Subscription[] = [];
  state: IPipelineMovetoPageState = {
    selectedStage: undefined,
    pipeline: undefined,
    realPipelines: [],
    pipelines: [],
    loading: true
  };
  constructor(
    protected readonly service: PipelineService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useShowSpinner();
  }
  ngOnInit() {
    this.useDispatch();
    this.useData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.payload.previousValue) {
      this.useSetData();
    }
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(pipelineSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(PipelineAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
  }
  useData = () => {
    this.subscriptions.push(
      this.store.select(pipelineSelector.pipelines)
        .pipe(
          tap((data) => {
            this.state.realPipelines = data;
            this.useSetData();
            this.useHideSpinner();
          })
        ).subscribe()
    );
  }
  useSelectPipeline = async (selected: string, stage?: StageVM) => {
    if (selected !== this.state.pipeline?.id) {
      this.state.pipeline = await this.service.findById(selected).toPromise();
      this.state.selectedStage = stage ? stage : this.state.pipeline.stages[0];
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
  useSetData = () => {
    this.state.pipeline = undefined;
    this.state.selectedStage = this.payload.deal.stage;
    if (!this.state.pipeline) {
      this.state.pipelines = this.state.realPipelines.filter((pipeline) => !pipeline.isDelete);
      const selectedPipeline = localStorage.getItem('selectedPipeline');
      this.useSelectPipeline(selectedPipeline, this.state.selectedStage);
    } else {
      this.state.pipelines = this.state.realPipelines.filter((pipeline) => pipeline.id === this.state.pipeline.id
        || (pipeline.id !== this.state.pipeline.id && !pipeline.isDelete));
      if (!this.state.selectedStage) {
        this.state.selectedStage = this.state.pipeline.stages[0];
      }
    }
  }
  useCancel = () => {
    this.useClose.emit();
    this.useSetData();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
