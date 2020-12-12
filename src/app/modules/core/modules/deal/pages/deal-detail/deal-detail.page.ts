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
import { AccountVM, ActivityVM, AttachmentVM, DealDetailVM, DealVM, NoteVM, PipelineVM, StageVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, pluck, switchMap, tap, catchError, map } from 'rxjs/operators';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { activitySelector, attachmentSelector, authSelector, dealDetailSelector, dealSelector, noteSelector, pipelineSelector, stageSelector } from '@store/selectors';
import { Subscription, of } from 'rxjs';
import { ActivityAction, AttachmentAction, DealAction, DealDetailAction, NoteAction, StageAction } from '@store/actions';
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
  dones: (ActivityVM & { subType: string } | NoteVM & { subType: string } | AttachmentVM & { subType: string })[];
  plans: (ActivityVM & { last?: boolean, state: string })[];
  filterDones: (ActivityVM & { subType: string } | NoteVM & { subType: string } | AttachmentVM & { subType: string })[];
  done: string;
  type: 'note' | 'attachment' | 'activity';
  close: boolean;
  stageMove: 'done' | 'processing';
  pins: NoteVM[];
  canAdd: boolean;
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
    dones: [],
    plans: [],
    filterDones: [],
    done: '',
    type: 'note',
    close: true,
    stageMove: 'done',
    pins: [],
    canAdd: false,
    canUpdate: false,
    canRemove: false,
  }
  constructor(
    protected readonly dealService: DealService,
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
    this.useData();
  }
  useSocket = () => {
    this.noteService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as NoteVM).deal.id === this.state.deal.id) {
        if (trigger.type === 'create') {
          this.state.deal.notes.push((trigger.data as NoteVM));
        } else if (trigger.type === 'update') {
          this.state.deal.notes[this.state.deal.notes.findIndex((e) => e.id === (trigger.data as NoteVM).id)] = (trigger.data as NoteVM);
        } else if (trigger.type === 'remove') {
          this.state.deal.notes.splice(this.state.deal.notes.findIndex((e) => e.id === (trigger.data as NoteVM).id), 1);
        }
        this.useFilter();
      }
    });
    this.dealDetailService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as DealDetailVM).deal.id === this.state.deal.id) {
        if (trigger.type === 'create') {
          this.state.deal.dealDetails.push((trigger.data as DealDetailVM));
        } else if (trigger.type === 'update') {
          this.state.deal.dealDetails[this.state.deal.dealDetails.findIndex((e) => e.id === (trigger.data as DealDetailVM).id)]
            = (trigger.data as DealDetailVM);
        } else if (trigger.type === 'remove') {
          this.state.deal.dealDetails.splice(this.state.deal.dealDetails.findIndex((e) => e.id === (trigger.data as DealDetailVM).id), 1);
        }
        this.useFilter();
      }
    });
    this.activityService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as ActivityVM).deal.id === this.state.deal.id) {
        if (trigger.type === 'create') {
          this.state.deal.activitys.push((trigger.data as ActivityVM));
        } else if (trigger.type === 'update') {
          this.state.deal.activitys[this.state.deal.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id)]
            = (trigger.data as ActivityVM);
        } else if (trigger.type === 'remove') {
          this.state.deal.activitys.splice(this.state.deal.activitys.findIndex((e) => e.id === (trigger.data as ActivityVM).id), 1);
        }
        this.useFilter();
      }
    });
    this.attachmentService.triggerSocket().subscribe((trigger) => {
      if ((trigger.data as AttachmentVM[])[0]?.deal.id === this.state.deal.id) {
        if (trigger.type === 'list') {
          (trigger.data as AttachmentVM[]).forEach((e) => this.state.deal.attachments.push(e));
        } else if (trigger.type === 'update') {
          this.state.deal.attachments[this.state.deal.attachments.findIndex((e) => e.id === (trigger.data as AttachmentVM).id)]
            = (trigger.data as AttachmentVM);
        } else if (trigger.type === 'remove') {
          this.state.deal.attachments.splice(this.state.deal.attachments.findIndex((e) => e.id === (trigger.data as AttachmentVM).id), 1);
        }
        this.useFilter();
      }
    });
  }
  useSaveFeedback = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.dealService
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
            this.state.you = profile;
            this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateDeal).length > 0;
            this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
            this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveDeal).length > 0;
          })
        )
        .subscribe()
    );
  }
  useDispatch = () => {
    this.subscriptions.push(
      this.store.select(dealSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.useReload();
            }
          })
        ).subscribe()
    );
    this.subscriptions.push(
      this.store.select(activitySelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(ActivityAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
    this.subscriptions.push(
      this.store.select(attachmentSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(AttachmentAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
    this.subscriptions.push(
      this.store.select(dealDetailSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(DealDetailAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
    this.subscriptions.push(
      this.store.select(noteSelector.firstLoad)
        .pipe(
          tap((firstLoad) => {
            if (!firstLoad) {
              this.store.dispatch(NoteAction.FindAllAction({}));
            }
          })
        ).subscribe()
    );
  }
  useData = () => {
    this.subscriptions.push(
      this.store.select(dealSelector.deals)
        .pipe(
          tap((data) => {
            this.state.deal = data.find((deal) => deal.id === this.state.id);
            if (this.state.deal) {
              this.useFilter();
            } else {
              this.router.navigate(['core/deal']);
              throw new Error('');
            }
          }),
          map((data) => data.find((deal) => deal.id === this.state.id)),
          switchMap((data) => this.stageService.findById(data.stage.id)),
          tap((data) => {
            this.state.stage = data;
          }),
          switchMap((data) => this.pipelineService.findById(data.pipeline.id)
            .pipe(finalize(() => {
              this.useHideSpinner();
            }))
          ),
          tap((data) => {
            this.state.pipeline = data;
          })
        ).subscribe()
    );
    this.subscriptions.push(
      this.store.select(noteSelector.notes)
        .pipe(
          tap((data) => {
            this.state.notes = data.filter((note) => note.deal.id === this.state.id);
            this.useFilter();
          })
        )
      .subscribe()
    );
    this.subscriptions.push(
      this.store.select(activitySelector.activitys)
        .pipe(
          tap((data) => {
            this.state.activitys = data.filter((activity) => activity.deal.id === this.state.id);
            this.useFilter();
          })
        )
      .subscribe()
    );
    this.subscriptions.push(
      this.store.select(attachmentSelector.attachments)
        .pipe(
          tap((data) => {
            this.state.attachments = data.filter((attachment) => attachment.deal.id === this.state.id);
            this.useFilter();
          })
        )
      .subscribe()
    );
    this.subscriptions.push(
      this.store.select(dealDetailSelector.dealDetails)
        .pipe(
          tap((data) => {
            this.state.dealDetails = data.filter((dealDetail) => dealDetail.deal.id === this.state.id);
            this.useFilter();
          })
        )
      .subscribe()
    );
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(DealAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
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
    this.state.dones = this.state.dones.concat(notes, attachments, activitys.filter((e) => e.status === 'done'))
      .sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
    this.state.plans = this.state.activitys.filter((e) => e.status === 'processing').sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
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
    if (this.state.deal.status === 'processing') {
      this.state.stage = stage;
      this.state.stageMove = 'done';
      this.subscriptions.push(
        this.dealService.update({
          ...this.state.deal,
          stage: { id: stage.id } as any, activitys: undefined,
          notes: undefined,
          logs: undefined,
          dealDetails: undefined,
          attachments: undefined,
        } as any)
          .pipe(
            tap(() => this.useReload())
          )
          .subscribe()
      );
    }
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useWon = () => {
    this.subscriptions.push(
      this.dealService.update({
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
      this.dealService.update({
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
      this.dealService.update({ ...this.state.deal, status: 'processing' })
        .pipe(
          tap((data) => this.state.deal = data)
        )
        .subscribe()
    );
  }
  useDelete = (ref: NbDialogRef<any>) => {
    ref.close();
    this.subscriptions.push(
      this.dealService.remove(this.state.deal.id).subscribe()
    );
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: { deal: this.state.deal, inside: true } });
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
    setTimeout(() => {
      this.spinner.hide('deal-detail');
    }, 2000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
