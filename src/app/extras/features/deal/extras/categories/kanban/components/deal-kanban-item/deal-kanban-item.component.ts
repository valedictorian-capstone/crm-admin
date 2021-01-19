import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { DealService, GlobalService } from '@services';
import { CampaignVM, DealVM, PipelineVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DropResult } from 'ngx-smooth-dnd';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { DealAction } from '@store/actions';

@Component({
  selector: 'app-deal-kanban-item',
  templateUrl: './deal-kanban-item.component.html',
  styleUrls: ['./deal-kanban-item.component.scss']
})
export class DealKanbanItemComponent implements OnDestroy {
  @Input() stage: StageVM;
  @Input() deals: DealVM[] = [];
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() search: string;
  @Input() isMain: boolean;
  @Input() campaign: CampaignVM;
  @Input() pipeline: PipelineVM;
  @Input() for: 'basic' | 'campaign' = 'basic';
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  dragging = false;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: DealService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
    protected readonly store: Store<State>,
  ) {
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an deal?',
      text: 'When you click OK button, an deal will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove deal successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove deal fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
  useAdd() {
    this.globalService.triggerView$.next({ type: 'deal', payload: { campaign: this.campaign, pipeline: this.campaign ? this.campaign.pipeline : this.pipeline, fix: !this.isMain, for: this.for, stage: this.stage } });
  }
  useDrop = (event: DropResult) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray(this.deals, event.removedIndex, event.addedIndex);
    } else {
      if (event.payload && event.payload.status === 'processing' && event.addedIndex != null) {
        const deal = { ...event.payload, changing: true };
        this.store.dispatch(DealAction.SaveSuccessAction({ res: { ...deal, stage: { id: this.stage.id } as any } }));
        this.subscriptions.push(
          this.service.update({ ...deal, stage: { id: this.stage.id } as any })
            .pipe(tap((res) => DealAction.SaveSuccessAction({res: {...res, changing: false} as any})))
            .subscribe()
        );
      }
    }
  }
  usePayload() {
    return (index: number) => {
      return this.deals[index];
    };
  }
}
