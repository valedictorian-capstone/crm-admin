import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DealService, GlobalService, StageService } from '@services';
import { DealUM, DealVM, PipelineVM, StageVM } from '@view-models';
import { map, finalize } from 'rxjs/operators';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pipeline-stage',
  templateUrl: './pipeline-stage.component.html',
  styleUrls: ['./pipeline-stage.component.scss']
})
export class PipelineStageComponent implements OnInit, OnChanges {
  @Output() useDragging: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stage: StageVM;
  @Input() selectedPipeline: PipelineVM;
  @Input() index: number;
  @Input() status = '';
  @Input() dragging = false;
  deals: DealVM[] = [];
  first = true;
  constructor(
    protected readonly router: Router,
    protected readonly globakService: GlobalService,
    protected readonly stageService: StageService,
    protected readonly dealService: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    dealService.triggerValue$.subscribe((trigger) => {
      if (trigger.data.stage.id === this.stage.id) {
        if (trigger.type === 'create') {
          this.stage.deals.push(trigger.data);
        } else if (trigger.type === 'update') {
          const pos = this.stage.deals.findIndex((e) => e.id === trigger.data.id);
          if (pos > -1) {
            this.stage.deals[pos] = trigger.data;
          } else {
            this.stage.deals.push(trigger.data);
          }
        } else {
          this.stage.deals.splice(this.stage.deals.findIndex((e) => e.id === trigger.data.id), 1);
        }
        this.useFilter(this.status);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!this.first) {
      this.useFilter(this.status);
    }
  }
  ngOnInit() {
    this.spinner.show('pipeline-stage' + this.stage.id);
    this.stageService.findById(this.stage.id)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.spinner.hide('pipeline-stage' + this.stage.id);
            this.first = false;
          }, 1000);
        }),
        map(async (data) => ({
          ...data,
          deals: await this.dealService.findByStage(data.id).toPromise()
        }))
      )
      .subscribe(async (stage) => {
        this.stage = (await stage);
        await this.useFilter(this.status);
      });
  }
  // useDrop(event: CdkDragDrop<(DealUM & { changing?: boolean })[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     const deal = event.previousContainer.data[event.previousIndex];
  //     deal.changing = true;
  //     deal.stage = { ...this.stage, deals: undefined };
  //     event.previousContainer.data.splice(event.previousIndex, 1);
  //     this.deals.push(deal as any);
  //     moveItemInArray(this.deals, event.container.data.length - 1, event.currentIndex);
  //     this.dealService.update({ ...deal, stage: { id: this.stage.id } as any }).subscribe((data) => {
  //       deal.changing = false;
  //     });

  //   }
  // }
  useDrop = (event: DropResult) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray(this.stage.deals, event.removedIndex, event.addedIndex);
      this.useFilter(this.status);
    } else {
      if (event.payload && event.payload.status === 'processing') {
        if (event.removedIndex != null) {
          this.stage.deals.splice(event.removedIndex, 1);
          this.useFilter(this.status);
        }
        if (event.addedIndex != null) {
          const deal = event.payload;
          deal.changing = true;
          deal.stage = { ...this.stage, deals: undefined };
          this.stage.deals.push(deal);
          moveItemInArray(this.stage.deals, this.stage.deals.length - 1, event.addedIndex);
          this.useFilter(this.status);
          this.dealService.update({ ...deal, stage: { id: this.stage.id } as any }).subscribe((data) => {
            deal.changing = false;
            this.useFilter(this.status);
          });
        }
      }
    }
  }
  usePayload() {
    return (index: number) => {
      return this.deals[index];
    };
  }
  useCreateDeal = () => {
    this.globakService.triggerView$.next({ type: 'deal', payload: { pipeline: this.selectedPipeline, stage: this.stage } });
  }
  useMove = (res: { deal: DealVM & { changing?: boolean }, moveToStage: StageVM }) => {
    this.stage.deals.splice(this.deals.findIndex(d => d.id === res.deal.id), 1);
    this.useFilter(this.status);
    this.dealService.update({ ...res.deal, stage: { id: res.moveToStage.id } as any }).subscribe((data) => {
      this.dealService.triggerValue$.next({type: 'update', data});
    });
  }
  useFilter = (status: string) => {
    this.deals = this.stage.deals.filter((deal) => deal.status.includes(status));
  }
}
