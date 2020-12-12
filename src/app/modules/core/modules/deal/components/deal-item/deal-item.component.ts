import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DealService } from '@services';
import { DealVM, StageVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-deal-item',
  templateUrl: './deal-item.component.html',
  styleUrls: ['./deal-item.component.scss']
})
export class DealItemComponent implements OnDestroy {
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<{ deal: DealVM & { changing?: boolean }, moveToStage: StageVM }> =
    new EventEmitter<{ deal: DealVM & { changing?: boolean }, moveToStage: StageVM }>();
  @Input() deal: DealVM & { changing?: boolean };
  @Input() canUpdate = false;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly router: Router,
    protected readonly dialogService: NbDialogService,
  ) { }

  useMoveTo = (stage: StageVM) => {
    this.useMove.emit({
      deal: {
        ...this.deal, changing: true, activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any, moveToStage: stage
    });
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useWon = () => {
    this.subscriptions.push(
      this.service.update({
        ...this.deal,
        status: 'won',
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)
        .pipe(
          tap((data) => this.deal = data)
        )
        .subscribe()
    );
  }
  useClose = () => {
    this.subscriptions.push(
      this.service.update({
        ...this.deal,
        status: 'lost',
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)
        .pipe(
          tap((data) => this.deal = data)
        )
        .subscribe()
    );
  }
  useDelete = () => {
    this.subscriptions.push(
      this.service.remove(this.deal.id)
        .pipe(
          tap(() => this.useRemove.emit())
        )
        .subscribe()
    );
  }
  useDetail = () => {
    if (this.canUpdate) {
      this.router.navigate(['core/deal/' + this.deal.id]);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
