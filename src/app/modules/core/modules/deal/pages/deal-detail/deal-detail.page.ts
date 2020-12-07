import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  ActivityService,
  AttachmentService,
  AuthService,
  DealDetailService,
  DealService,
  GlobalService,
  NoteService,
  PipelineService,
  StageService
} from '@services';
import { ActivityVM, AttachmentVM, DealDetailVM, DealVM, NoteVM, PipelineVM, StageVM } from '@view-models';
import { ActivatedRoute } from '@angular/router';
import { pluck, switchMap, tap, map, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NbDialogService, NbDialogRef, NbToastrService } from '@nebular/theme';

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
  canAdd = false;
  canUpdate = false;
  canRemove = false;
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
    protected readonly toastrService: NbToastrService,
    protected readonly authService: AuthService,
  ) {
    this.useReload();
    dealService.triggerSocket().subscribe((trigger) => {
      this.useReload();
    });
    noteService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as NoteVM).deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          this.deal.notes.push((trigger.data as NoteVM));
        } else if (trigger.type === 'update') {
          this.deal.notes[this.deal.notes.findIndex((e) => e.id === (trigger.data as NoteVM).id)] = (trigger.data as NoteVM);
        } else if (trigger.type === 'remove') {
          this.deal.notes.splice(this.deal.notes.findIndex((e) => e.id === (trigger.data as NoteVM).id), 1);
        }
        this.useFilter();
      }
    });
    dealDetailService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as DealDetailVM).deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          this.deal.dealDetails.push((trigger.data as DealDetailVM));
        } else if (trigger.type === 'update') {
          this.deal.dealDetails[this.deal.dealDetails.findIndex((e) => e.id === (trigger.data as DealDetailVM).id)]
            = (trigger.data as DealDetailVM);
        } else if (trigger.type === 'remove') {
          this.deal.dealDetails.splice(this.deal.dealDetails.findIndex((e) => e.id === (trigger.data as DealDetailVM).id), 1);
        }
        this.useFilter();
      }
    });
    activityService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as ActivityVM).deal.id === this.deal.id) {
        if (trigger.type === 'create') {
          this.deal.activitys.push((trigger.data as ActivityVM));
        } else if (trigger.type === 'update') {
          this.deal.activitys[this.deal.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id)]
            = (trigger.data as ActivityVM);
        } else if (trigger.type === 'remove') {
          this.deal.activitys.splice(this.deal.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id), 1);
        }
        this.useFilter();
      }
    });
    attachmentService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as AttachmentVM[])[0]?.deal.id === this.deal.id) {
        if (trigger.type === 'list') {
          (trigger.data as AttachmentVM[]).forEach((e) => this.deal.attachments.push(e));
        } else if (trigger.type === 'update') {
          this.deal.attachments[this.deal.attachments.findIndex((e) => e.id === (trigger.data as AttachmentVM).id)]
          = (trigger.data as AttachmentVM);
        } else if (trigger.type === 'remove') {
          this.deal.attachments.splice(this.deal.attachments.findIndex((e) => e.id === (trigger.data as AttachmentVM).id), 1);
        }
        this.useFilter();
      }
    });
  }
  ngOnInit() {
    this.useLoadMine();
  }
  useSaveFeedback = () => {
    this.spinner.show('deal-detail');
    this.dealService
      .update({
      id: this.deal.id,
      feedbackMessage: this.deal.feedbackMessage,
      feedbackRating: this.deal.feedbackRating,
      feedbackStatus: this.deal.feedbackStatus,
      } as any)
      .pipe(
        finalize(() => {
          this.spinner.hide('deal-detail');
        })
      )
      .subscribe((data) => {
      this.toastrService.success('', 'Save feedback successful', { duration: 3000 });
    }, () => {
      this.toastrService.success('', 'Save feedback fail', { duration: 3000 });
    });
  }
  useLoadMine = () => {
    this.authService.auth(undefined).subscribe((data) => {
      this.canAdd = data.roles.filter((role) => role.canCreateCustomer).length > 0;
      this.canUpdate = data.roles.filter((role) => role.canUpdateCustomer).length > 0;
      this.canRemove = data.roles.filter((role) => role.canRemoveCustomer).length > 0;
    });
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
      status: 'lost',
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
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
}
