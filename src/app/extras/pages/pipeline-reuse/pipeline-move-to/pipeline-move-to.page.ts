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

  }
  ngOnInit() {
    this.useDispatch();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.payload.previousValue) {
      this.useSetData();
    }
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.pipeline)
      .pipe(
        tap((pipeline) => {
          const firstLoad = pipeline.firstLoad;
          const data = (pipeline.ids as string[]).map((id) => pipeline.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.realPipelines = data;
            this.useSetData();
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(PipelineAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSelectPipeline = async (selected: PipelineVM) => {
    if (this.payload.deal) {
      if (this.payload.deal.stage.pipeline.id !== selected.id) {
        this.state.pipeline = selected;
        this.state.selectedStage = this.state.pipeline.stages.find((stage) => stage.position === 0);
      } else {
        this.state.selectedStage = this.payload.deal.stage;
      }
    } else {
      if (selected.id !== this.state.pipeline?.id) {
        this.state.pipeline = selected;
        this.state.selectedStage = this.state.pipeline.stages.find((stage) => stage.position === 0);
      }
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
    if (this.payload.deal) {
      this.state.selectedStage = this.payload.deal.stage;
      this.state.pipeline = this.payload.deal.stage.pipeline;
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
