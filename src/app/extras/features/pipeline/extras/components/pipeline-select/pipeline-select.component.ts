import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { PipelineAction } from '@store/actions';
import { State } from '@store/states';
import { PipelineVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface IPipelineSelectComponentState {
  search: string;
  array: PipelineVM[];
  filterArray: PipelineVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-pipeline-select',
  templateUrl: './pipeline-select.component.html',
  styleUrls: ['./pipeline-select.component.scss']
})
export class PipelineSelect1Component implements OnInit, OnDestroy {
  @Input() modelChange: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  @Input() control: FormControl;
  @Input() model: PipelineVM;
  subscriptions: Subscription[] = [];
  state: IPipelineSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>,
    protected readonly spinner: NgxSpinnerService,
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
            this.useSearch();
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
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((pipeline) => pipeline.name.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('pipeline-select');
  }
  useSelectItem(item: PipelineVM) {
    if (this.control) {
      this.control.setValue(item);
    }
    this.model = item;
    this.modelChange.emit(item);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
