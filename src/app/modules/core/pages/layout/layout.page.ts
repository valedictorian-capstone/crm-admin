import {
  AccountAction, ActivityAction,
  AttachmentAction,




  CategoryAction,
  CommentAction,
  CustomerAction, DealAction,


  DealDetailAction, DeviceAction,










  EventAction,






  GroupAction, LogAction, NoteAction,
  NotificationAction, PipelineAction,








  ProductAction,
  RoleAction, StageAction,









  TicketAction
} from '@actions';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AuthService, GlobalService } from '@services';
import { authSelector } from '@store/selectors';
import { State } from '@store/states';
import { AccountVM } from '@view-models';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})
export class LayoutPage implements OnInit {
  @ViewChild('globalCreatRef') globalCreatRef: TemplateRef<any>;
  you: AccountVM;
  canSetting = false;
  constructor(
    protected readonly dialogService: NbDialogService,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
    globalService.triggerView$
      .pipe(
      )
      .subscribe((context) => this.useDialog(context));
  }

  ngOnInit() {
    this.useSocket();
    this.useLoadAll();
  }
  useLoadMine = () => {
    this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.you = profile;
            if (Math.min(...this.you.roles.map((e) => e.level)) <= 0) {
              this.canSetting = true;
            }
          }
        })
      )
      .subscribe()
  }
  useSocket = () => {
    this.authService.triggerValue$.subscribe((data) => {
      this.you = data;
      if (Math.min(...data.roles.map((e) => e.level)) <= 0) {
        this.canSetting = true;
      }
    });
  }
  useLoadAll = () => {
    this.store.dispatch(DealAction.ResetAction());
    this.store.dispatch(ActivityAction.ResetAction());
    this.store.dispatch(AttachmentAction.ResetAction());
    this.store.dispatch(DealDetailAction.ResetAction());
    this.store.dispatch(PipelineAction.ResetAction());
    this.store.dispatch(StageAction.ResetAction());
    this.store.dispatch(AccountAction.ResetAction());
    this.store.dispatch(CategoryAction.ResetAction());
    this.store.dispatch(CommentAction.ResetAction());
    this.store.dispatch(CustomerAction.ResetAction());
    this.store.dispatch(EventAction.ResetAction());
    this.store.dispatch(GroupAction.ResetAction());
    this.store.dispatch(NoteAction.ResetAction());
    this.store.dispatch(NotificationAction.ResetAction());
    this.store.dispatch(ProductAction.ResetAction());
    this.store.dispatch(RoleAction.ResetAction());
    this.store.dispatch(TicketAction.ResetAction());
    this.store.dispatch(CustomerAction.SocketAction());
    this.store.dispatch(AccountAction.SocketAction());
    this.store.dispatch(RoleAction.SocketAction());
    this.store.dispatch(TicketAction.SocketAction({
      requester: this.you
    }));
    this.store.dispatch(ActivityAction.SocketAction({
      requester: this.you
    }));
    this.store.dispatch(LogAction.SocketAction());
    this.store.dispatch(AttachmentAction.SocketAction());
    this.store.dispatch(DealAction.SocketAction());
    this.store.dispatch(CategoryAction.SocketAction());
    this.store.dispatch(DeviceAction.SocketAction());
    this.store.dispatch(DealDetailAction.SocketAction());
    this.store.dispatch(PipelineAction.SocketAction());
    this.store.dispatch(StageAction.SocketAction());
    this.store.dispatch(CommentAction.SocketAction());
    this.store.dispatch(EventAction.SocketAction());
    this.store.dispatch(NoteAction.SocketAction());
    this.store.dispatch(NotificationAction.SocketAction());
    this.store.dispatch(ProductAction.SocketAction());
  }
  useDialog(context: { type: string, payload: any }) {
    (context);
    this.dialogService.open<{ type: string, payload: any }>(this.globalCreatRef, { closeOnBackdropClick: true, context });
  }
  useCheckRole = (name: string) => {
    return this.you.roles.filter((role) => role[name]).length > 0;
  }
}
