import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  ActivityService,
  AttachmentService,
  DealDetailService,
  DealService,
  GlobalService,
  NoteService,
  PipelineService,
  StageService
} from '@services';
import { ActivityVM, AttachmentVM, DealVM, NoteVM, PipelineVM, StageVM } from '@view-models';
import { ActivatedRoute } from '@angular/router';
import { pluck, switchMap, tap, map, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.page.html',
  styleUrls: ['./deal-detail.page.scss']
})
export class DealDetailPage implements OnInit {
  deal: DealVM;
  stage: StageVM;
  pipeline: PipelineVM;
  dones: (ActivityVM & { subType: string } | NoteVM & { subType: string } | AttachmentVM & { subType: string })[] = [];
  plans: (ActivityVM & { last?: boolean, state: string })[] = [];
  filterDones: (ActivityVM & { subType: string } | NoteVM & { subType: string } | AttachmentVM & { subType: string })[] = [];
  done = '';
  type = 'note';
  close = true;
  stageMove = 'done';
  pins: NoteVM[] = [];
  constructor(
    protected readonly dealService: DealService,
    protected readonly dealDetailService: DealDetailService,
    protected readonly stageService: StageService,
    protected readonly pipelineService: PipelineService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
    protected readonly noteService: NoteService,
    protected readonly globalService: GlobalService,
    protected readonly activityService: ActivityService,
    protected readonly attachmentService: AttachmentService,
  ) {
    this.useReload();
    dealService.triggerValue$.subscribe((trigger) => {
      this.useReload();
    });
    noteService.triggerValue$.subscribe((trigger) => {
      if (trigger.data.deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          this.deal.notes.push(trigger.data);
        } else if (trigger.type === 'update') {
          this.deal.notes[this.deal.notes.findIndex((e) => e.id === trigger.data.id)] = trigger.data;
        } else {
          this.deal.notes.splice(this.deal.notes.findIndex((e) => e.id === trigger.data.id), 1);
        }
        this.useFilter();
      }
    });
    dealDetailService.triggerValue$.subscribe((trigger) => {
      if (trigger.data.deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          this.deal.dealDetails.push(trigger.data);
        } else if (trigger.type === 'update') {
          this.deal.dealDetails[this.deal.dealDetails.findIndex((e) => e.id === trigger.data.id)] = trigger.data;
        } else {
          this.deal.dealDetails.splice(this.deal.dealDetails.findIndex((e) => e.id === trigger.data.id), 1);
        }
        this.useFilter();
      }
    });
    activityService.triggerValue$.subscribe((trigger) => {
      if (trigger.data.deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          this.deal.activitys.push(trigger.data);
        } else if (trigger.type === 'update') {
          this.deal.activitys[this.deal.activitys.findIndex((e) => e.id === trigger.data.id)] = trigger.data;
        } else {
          this.deal.activitys.splice(this.deal.activitys.findIndex((e) => e.id === trigger.data.id), 1);
        }
        this.useFilter();
      }
    });
    attachmentService.triggerValue$.subscribe((trigger) => {
      if (trigger.data[0]?.deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          trigger.data.forEach((e) => this.deal.attachments.push(e));
        } else if (trigger.type === 'update') {
          trigger.data.forEach((data) => {
            this.deal.attachments[this.deal.attachments.findIndex((e) => e.id === data.id)] = data;
          });
        } else {
          trigger.data.forEach((data) => {
            this.deal.attachments.splice(this.deal.attachments.findIndex((e) => e.id === data.id), 1);
          });
        }
        this.useFilter();
      }
    });
  }
  ngOnInit() {
  }
  useReload = () => {
    this.spinner.show('deal-detail');
    this.activatedRoute.params
      .pipe(
        pluck('id'),
        switchMap((id) => this.dealService.findById(id)),
        tap((data) => {
          this.deal = data;
          this.useFilter();
        }),
        switchMap((data) => this.stageService.findById(data.stage.id)),
        tap((data) => {
          this.stage = data;
        }),
        switchMap((data) => this.pipelineService.findById(data.pipeline.id)),
        tap((data) => {
          this.pipeline = data;
          this.spinner.hide('deal-detail');
        }),
      )
      .subscribe();
  }
  useFilter = () => {
    this.pins = this.deal.notes.filter((e) => e.pin)
      .map((e) => ({
        ...e
      }));
    this.plans = [];
    this.dones = [];
    const activitys = this.deal.activitys
      .map((e) => ({
        ...e, subType: 'activity'
      }));
    const notes = this.deal.notes
      .map((e) => ({
        ...e, subType: 'note'
      }));
    const attachments = this.deal.attachments
      .map((e) => ({
        ...e, subType: 'attachment'
      }));
    this.dones = this.dones.concat(notes, attachments, activitys.filter((e) => e.status === 'done'))
      .sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    this.plans = this.deal.activitys.filter((e) => e.status === 'processing').sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
      .map((e) => ({
        ...e,
        dateStart: new Date(e.dateStart),
        dateEnd: new Date(e.dateEnd),
        state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired')
      }));
    this.useSelectDone();
  }
  useSelectDone = () => {
    this.filterDones = this.dones.filter((e) => e.subType.includes(this.done));
    if (this.filterDones.length === 0) {
      this.plans = this.plans.map((e, i) => ({ ...e, last: false }));
    } else {
      this.plans = this.plans.map((e, i) => ({ ...e, last: i === this.plans.length - 1 }));
    }
  }
  useLength = (subType: string) => {
    return this.dones.filter((e) => e.subType === subType).length > 0 ? this.dones.filter((e) => e.subType === subType).length : 0;
  }
  useMoveTo = (stage: StageVM) => {
    if (this.deal.status === 'processing') {
      this.stage = stage;
      this.stageMove = 'done';
      this.dealService.update({
        ...this.deal,
        stage: { id: stage.id } as any, activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any).subscribe((data) => {
        this.useReload();
        this.dealService.triggerValue$.next({ type: 'update', data });
      });
    }
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
  useReopen = () => {
    this.dealService.update({ ...this.deal, status: 'processing' }).subscribe((data) => this.deal = data);
  }
  useDelete = (ref: NbDialogRef<any>) => {
    ref.close();
    this.dealService.remove(this.deal.id);
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: { deal: this.deal, inside: true } });
  }
  usePlus = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: { deal: this.deal, fixDeal: true } });
  }
  useCustomerProfile = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.deal.customer } });
  }
}
