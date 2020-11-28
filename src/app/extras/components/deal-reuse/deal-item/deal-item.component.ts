import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DealService } from '@services';
import { DealVM } from '@view-models';
@Component({
  selector: 'app-reuse-deal-item',
  templateUrl: './deal-item.component.html',
  styleUrls: ['./deal-item.component.scss']
})
export class DealItemComponent implements OnInit {
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Input() deal: DealVM;
  constructor(
    protected readonly router: Router,
    protected readonly dealService: DealService,
    protected readonly dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.dealService.findById(this.deal.id).subscribe((data) => this.deal = data);
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
