import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DealService } from '@services';
import { DealVM, StageVM } from '@view-models';

@Component({
  selector: 'app-pipeline-deal',
  templateUrl: './pipeline-deal.component.html',
  styleUrls: ['./pipeline-deal.component.scss']
})
export class PipelineDealComponent implements OnInit {
  @Output() useDragging: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useMove: EventEmitter<{ deal: DealVM & { changing?: boolean }, moveToStage: StageVM }> =
    new EventEmitter<{ deal: DealVM & { changing?: boolean }, moveToStage: StageVM }>();
  @Input() deal: DealVM & { changing?: boolean };
  @Input() dragging = false;
  constructor(
    protected readonly router: Router,
    protected readonly dealService: DealService,
    protected readonly dialogService: NbDialogService,
  ) { }

  ngOnInit() {
  }

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
    this.dealService.update({
      ...this.deal,
      status: 'won',
      activitys: undefined,
      notes: undefined,
      logs: undefined,
      dealDetails: undefined,
      attachments: undefined,
    } as any).subscribe((data) => this.deal = data);
  }
  useClose = () => {
    this.dealService.update({
      ...this.deal,
      status: 'close',
      activitys: undefined,
      notes: undefined,
      logs: undefined,
      dealDetails: undefined,
      attachments: undefined,
    } as any).subscribe((data) => this.deal = data);
  }
  useDelete = () => {
    this.dealService.remove(this.deal.id).subscribe(() => this.useRemove.emit());
  }
  useDetail = () => {
    this.router.navigate(['core/deal/' + this.deal.id]);
  }
}
