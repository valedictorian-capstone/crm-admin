import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDealMainState } from '@extras/features/deal';
import { ISort } from '@extras/interfaces';
import { CampaignVM, PipelineVM, StageVM } from '@view-models';

@Component({
  selector: 'app-deal-kanban',
  templateUrl: './deal-kanban.area.html',
  styleUrls: ['./deal-kanban.area.scss']
})
export class DealKanbanArea {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Input() state: IDealMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: 'basic' | 'campaign' = 'basic';
  @Input() campaign: CampaignVM;
  @Input() pipeline: PipelineVM;

  ngOnChanges() {
    console.log(this.pipeline);
  }
  useGetDeals = (stage: StageVM) => {
    return this.state.filterArray.filter((e) => e.stage.id === stage.id);
  }
}
