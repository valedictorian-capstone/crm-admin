import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PipelineVM } from '@view-models';
import { PipelineService } from '@services';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PipelineAction } from '@store/actions';
import { pipelineSelector } from '@store/selectors';
import { Store } from '@ngrx/store';
import { State } from '@store/states';

interface IPipelineSelectComponentState {
  search: string;
  array: PipelineVM[];
  filterArray: PipelineVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-reuse-pipeline-select',
  templateUrl: './pipeline-select.component.html',
  styleUrls: ['./pipeline-select.component.scss']
})
export class PipelineSelectComponent implements OnInit, OnDestroy {
  @Output() useSelect: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  @Input() selected: PipelineVM;
  subscriptions: Subscription[] = [];
  state: IPipelineSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>
  ) { }
  ngOnInit() {
    this.useDispatch();
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
            this.state.array = data;
            this.useSearch('');
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.state.status = 'finding';
    this.store.dispatch(PipelineAction.FindAllAction({
      finalize: () => {
        this.state.status = 'done';
      }
    }));
  }
  useSearch = (value: string) => {
    this.state.search = value;
    this.state.filterArray = this.state.array.filter((pipeline) => pipeline.name.toLowerCase().includes(value.toLowerCase()));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
