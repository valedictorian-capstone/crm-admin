import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DealService, GlobalService, StageService } from '@services';
import { DealUM, DealVM, PipelineVM, StageVM } from '@view-models';
import { map, finalize, tap } from 'rxjs/operators';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DealAction } from '@store/actions';
import { Store } from '@ngrx/store';
import { State } from '@store/states';

@Component({
  selector: 'app-pipeline-stage',
  templateUrl: './pipeline-stage.component.html',
  styleUrls: ['./pipeline-stage.component.scss']
})
export class PipelineStageComponent implements OnInit, OnChanges, OnDestroy {
  @Output() useDragging: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stage: StageVM;
  @Input() selectedPipeline: PipelineVM;
  @Input() index: number;
  @Input() search = {
    assignees: [],
    customer: undefined,
    status: '',
    name: '',
    range: undefined
  };
  @Input() dragging = false;
  deals: DealVM[] = [];
  realDeals: DealVM[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly router: Router,
    protected readonly globakService: GlobalService,
    protected readonly stageService: StageService,
    protected readonly dealService: DealService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.useFilter();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select((state) => state.deal)
        .pipe(
          tap((deal) => {
            const data = (deal.ids as string[]).map((id) => deal.entities[id]);
            this.realDeals = data.filter((deal) => deal.stage.id === this.stage.id);
            this.useFilter();
          })
        ).subscribe()
    );
  }
  useDrop = (event: DropResult) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray(this.realDeals, event.removedIndex, event.addedIndex);
      this.useFilter();
    } else {
      if (event.payload && event.payload.status === 'processing') {
        if (event.removedIndex != null) {
          this.realDeals.splice(event.removedIndex, 1);
          this.useFilter();
        }
        if (event.addedIndex != null) {
          const deal = { ...event.payload };
          console.log(deal);
          deal.changing = true;
          deal.stage = { ...this.stage, deals: undefined };
          this.realDeals.push(deal);
          moveItemInArray(this.realDeals, this.realDeals.length - 1, event.addedIndex);
          this.useFilter();
          this.subscriptions.push(
            this.dealService.update({ ...deal, stage: { id: this.stage.id } as any })
              .subscribe()
          );
        }
      }
    }
  }
  usePayload() {
    return (index: number) => {
      return this.realDeals[index];
    };
  }
  useCreateDeal = () => {
    this.globakService.triggerView$.next({ type: 'deal', payload: { pipeline: this.selectedPipeline, stage: this.stage } });
  }
  useMove = (res: { deal: DealVM & { changing?: boolean }, moveToStage: StageVM }) => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.dealService.update({ ...res.deal, stage: { id: res.moveToStage.id } as any })
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useFilter = () => {
    console.log(this.search);
    this.deals = this.realDeals.filter((deal) => deal.status.includes(this.search.status));
    this.deals = this.realDeals.filter((deal) =>
      (deal.status.includes(this.search.status)) &&
      (deal.title.toLowerCase().includes(this.search.name.toLowerCase())) &&
      (this.search.range?.start ? new Date(deal.createdAt).getTime() >= new Date(this.search.range.start).getTime() : true) &&
      (this.search.range?.end ? new Date(deal.createdAt).getTime() <= new Date(this.search.range.end).getTime() : true) &&
      (this.search.customer ? deal.customer.id === this.search.customer.id : true) &&
      (this.search.assignees.length > 0
        ? (this.search.assignees.findIndex((assingee) => assingee.id === deal.assignee?.id) > -1) : true)
    );
  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-stage' + this.stage.id);
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('pipeline-stage' + this.stage.id);
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
