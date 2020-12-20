import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
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
import { AccountVM, ActivityVM, AttachmentVM, DealDetailVM, DealVM, LogVM, NoteVM, PipelineVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, pluck, switchMap, tap, catchError, map, delay } from 'rxjs/operators';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { activitySelector, attachmentSelector, authSelector, dealDetailSelector, dealSelector, noteSelector, pipelineSelector, stageSelector } from '@store/selectors';
import { Subscription, of } from 'rxjs';
import { ActivityAction, AttachmentAction, DealAction, DealDetailAction, LogAction, NoteAction, PipelineAction, StageAction } from '@store/actions';
interface IDealDetailPageState {
  id: string;
  you: AccountVM;
  deal: DealVM;
  stage: StageVM;
  pipeline: PipelineVM;
  notes: NoteVM[];
  activitys: ActivityVM[];
  attachments: AttachmentVM[];
  dealDetails: DealDetailVM[];
  logs: LogVM[];
  dones: (ActivityVM & { subType: string } | NoteVM & { subType: string } | AttachmentVM & { subType: string } | LogVM & { subType: string })[];
  plans: (ActivityVM & { last?: boolean, state: string })[];
  filterDones: (ActivityVM & { subType: string } | NoteVM & { subType: string } | AttachmentVM & { subType: string } | LogVM & { subType: string })[];
  done: string;
  type: 'note' | 'attachment' | 'activity';
  close: boolean;
  stageMove: 'done' | 'processing';
  pins: NoteVM[];
  canAdd: boolean;
  canGetAssign: boolean;
  canGetFeedback: boolean;
  canUpdate: boolean;
  canRemove: boolean;
}
@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.page.html',
  styleUrls: ['./deal-detail.page.scss']
})
export class DealDetailPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  state: IDealDetailPageState = {
    id: undefined,
    you: undefined,
    deal: undefined,
    stage: undefined,
    pipeline: undefined,
    notes: [],
    activitys: [],
    attachments: [],
    dealDetails: [],
    logs: [],
    dones: [],
    plans: [],
    filterDones: [],
    done: '',
    type: 'note',
    close: true,
    stageMove: 'done',
    pins: [],
    canAdd: false,
    canGetAssign: false,
    canGetFeedback: false,
    canUpdate: false,
    canRemove: false,
  };
  constructor(
    protected readonly service: DealService,
    protected readonly dealDetailService: DealDetailService,
    protected readonly stageService: StageService,
    protected readonly pipelineService: PipelineService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
    protected readonly noteService: NoteService,
    protected readonly globalService: GlobalService,
    protected readonly activityService: ActivityService,
    protected readonly attachmentService: AttachmentService,
    protected readonly toastrService: NbToastrService,
    protected readonly store: Store<State>
  ) {
    this.subscriptions.push(
      this.activatedRoute.params
        .pipe(
          pluck('id'),
          tap((id) => this.state.id = id)
        ).subscribe()
    );
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useSaveFeedback = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.service
        .update({
          id: this.state.deal.id,
          feedbackMessage: this.state.deal.feedbackMessage,
          feedbackRating: this.state.deal.feedbackRating,
          feedbackStatus: this.state.deal.feedbackStatus,
        } as any)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save feedback successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.success('', 'Save feedback fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe()
    );
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.state.canGetAssign = this.state.you.roles.filter((role) => role.canGetAssignDeal).length > 0;
              this.state.canGetFeedback = this.state.you.roles.filter((role) => role.canGetFeedbackDeal).length > 0;
              this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateDeal).length > 0;
              this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
              this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveDeal).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select((state) => state)
        .pipe(
          tap((state) => {
            if (this.state.deal) {
              const data = (state.note.ids as string[]).map((id) => state.note.entities[id]);
              this.state.notes = data.filter((note) => note.deal.id === this.state.id);
            }
          }),
          tap((state) => {
            if (this.state.deal) {
              const data = (state.attachment.ids as string[]).map((id) => state.attachment.entities[id]);
              this.state.attachments = data.filter((attachment) => attachment.deal.id === this.state.id);
            }
          }),
          tap((state) => {
            if (this.state.deal) {
              const data = (state.activity.ids as string[]).map((id) => state.activity.entities[id]);
              this.state.activitys = data.filter((activity) => activity.deal.id === this.state.id);
            }
          }),
          tap((state) => {
            if (this.state.deal) {
              const data = (state.dealDetail.ids as string[]).map((id) => state.dealDetail.entities[id]);
              this.state.dealDetails = data.filter((dealDetail) => dealDetail.deal.id === this.state.id);
            }
          }),
          tap((state) => {
            if (this.state.deal) {
              const data = (state.log.ids as string[]).map((id) => state.log.entities[id]);
              this.state.logs = data.filter((log) => log.deal.id === this.state.id);
            }
          }),
          tap((deal) => {
            if (!this.state.deal) {
              this.useReload();
            }
          }),
          tap(() => this.useFilter())
        ).subscribe()
    );
  }
  useReload = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.service.findById(this.state.id)
        .pipe(
          tap((deal) => {
            this.state.deal = deal;
            this.state.stage = this.state.deal.stage;
            this.state.pipeline = this.state.stage.pipeline;
            this.state.activitys = this.state.deal.activitys.map((e) => ({ ...e, deal: this.state.deal }));
            this.store.dispatch(ActivityAction.ListAction({ res: this.state.activitys }));
            this.state.notes = this.state.deal.notes.map((e) => ({ ...e, deal: this.state.deal }));;
            this.store.dispatch(NoteAction.ListAction({ res: this.state.notes }));
            this.state.attachments = this.state.deal.attachments.map((e) => ({ ...e, deal: this.state.deal }));;
            this.store.dispatch(AttachmentAction.ListAction({ res: this.state.attachments }));
            this.state.dealDetails = this.state.deal.dealDetails.map((e) => ({ ...e, deal: this.state.deal }));;
            this.store.dispatch(DealDetailAction.ListAction({ res: this.state.dealDetails }));
            this.state.logs = this.state.deal.logs.map((e) => ({ ...e, deal: this.state.deal }));;
            this.store.dispatch(LogAction.ListAction({ res: this.state.logs }));
          }),
          finalize(() => this.useHideSpinner())
        ).subscribe()
    );
  }
  useFilter = () => {
    this.state.pins = this.state.notes.filter((e) => e.pin)
      .map((e) => ({
        ...e
      }));
    this.state.plans = [];
    this.state.dones = [];
    const activitys = this.state.activitys
      .map((e) => ({
        ...e, subType: 'activity'
      }));
    const notes = this.state.notes
      .map((e) => ({
        ...e, subType: 'note'
      }));
    const attachments = this.state.attachments
      .map((e) => ({
        ...e, subType: 'attachment'
      }));
    const logs = this.state.logs
      .map((e) => ({
        ...e, subType: 'log'
      }));
    this.state.dones = this.state.dones.concat(notes, attachments, logs, activitys.filter((e) => e.status === 'done'))
      .sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);
    this.state.plans = this.state.activitys.filter((e) => e.status === 'processing').sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
      .map((e) => ({
        ...e,
        dateStart: new Date(e.dateStart),
        dateEnd: new Date(e.dateEnd),
        state: new Date() < new Date(e.dateStart) ? 'notStart' : (new Date() >= new Date(e.dateStart) && new Date() < new Date(e.dateEnd) ? 'processing' : 'expired')
      }));
    this.useSelectDone();
  }
  useSelectDone = () => {
    this.state.filterDones = this.state.dones.filter((e) => e.subType.includes(this.state.done));
    if (this.state.filterDones.length === 0) {
      this.state.plans = this.state.plans.map((e, i) => ({ ...e, last: false }));
    } else {
      this.state.plans = this.state.plans.map((e, i) => ({ ...e, last: i === this.state.plans.length - 1 }));
    }
  }
  useLength = (subType: string) => {
    return this.state.dones.filter((e) => e.subType === subType).length > 0 ? this.state.dones.filter((e) => e.subType === subType).length : 0;
  }
  useMoveTo = (stage: StageVM) => {
    if (this.state.deal.status === 'processing' && this.state.canUpdate) {
      this.state.stage = stage;
      this.state.stageMove = 'done';
      this.subscriptions.push(
        this.service.update({
          ...this.state.deal,
          stage: { id: stage.id } as any, activitys: undefined,
          notes: undefined,
          logs: undefined,
          dealDetails: undefined,
          attachments: undefined,
        } as any).subscribe()
      );
    }
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useWon = () => {
    this.subscriptions.push(
      this.service.update({
        ...this.state.deal,
        status: 'won',
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)
        .pipe(
          tap((data) => this.state.deal = data)
        )
        .subscribe()
    );
  }
  useClose = () => {
    this.subscriptions.push(
      this.service.update({
        ...this.state.deal,
        status: 'lost',
        activitys: undefined,
        notes: undefined,
        logs: undefined,
        dealDetails: undefined,
        attachments: undefined,
      } as any)
        .pipe(
          tap((data) => this.state.deal = data)
        )
        .subscribe()
    );
  }
  useReopen = () => {
    this.subscriptions.push(
      this.service.update({ ...this.state.deal, status: 'processing' })
        .pipe(
          tap((data) => this.state.deal = data)
        )
        .subscribe()
    );
  }
  useDelete = (ref: NbDialogRef<any>) => {
    ref.close();
    this.subscriptions.push(
      this.service.remove(this.state.deal.id).subscribe()
    );
  }
  useEdit = () => {
    if (this.state.canUpdate) {
      this.globalService.triggerView$.next({ type: 'deal', payload: { deal: this.state.deal, inside: true } });
    }
  }
  usePlus = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: { deal: this.state.deal, fixDeal: true } });
  }
  useCustomerProfile = () => {
    this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: this.state.deal.customer } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-detail');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-detail');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
