import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DealService } from '@services';
import { DealVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-deal',
  templateUrl: './pipeline-deal.component.html',
  styleUrls: ['./pipeline-deal.component.scss']
})
export class PipelineDealComponent implements OnDestroy {
  @Output() useDragging: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<{ deal: DealVM & { changing?: boolean }, moveToStage: StageVM }> =
    new EventEmitter<{ deal: DealVM & { changing?: boolean }, moveToStage: StageVM }>();
  @Input() deal: DealVM & { changing?: boolean };
  @Input() dragging = false;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly router: Router,
    protected readonly dealService: DealService,
    protected readonly spinner: NgxSpinnerService,
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
    this.useShowSpinner();
    this.subscriptions.push(
      this.dealService.update({
        ...this.deal,
        status: 'won',
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useClose = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.dealService.update({
        ...this.deal,
        status: 'lost',
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useDelete = () => {
    this.dealService.remove(this.deal.id).subscribe(() => this.useRemove.emit());
  }
  useDetail = () => {
    this.router.navigate(['core/deal/' + this.deal.id]);
  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-deatail');
  }
  useHideSpinner = () => {
    this.spinner.hide('pipeline-deatail');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
