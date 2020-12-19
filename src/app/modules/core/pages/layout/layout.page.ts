import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AuthService, GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { tap } from 'rxjs/operators';
import { authSelector } from '@store/selectors';
import {
  DeviceAction,
  DealAction,
  ActivityAction,
  AttachmentAction,
  DealDetailAction,
  PipelineAction,
  StageAction,
  AccountAction,
  CategoryAction,
  CommentAction,
  CustomerAction,
  EventAction,
  NoteAction,
  NotificationAction,
  ProductAction,
  RoleAction,
  TicketAction,
  LogAction,
} from '@actions';
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
          } else {
            this.canSetting = false;
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
    console.log(context);
    this.dialogService.open<{ type: string, payload: any }>(this.globalCreatRef, { closeOnBackdropClick: true, context });
  }
  useCheckRole = (name: string) => {
    return this.you.roles.filter((role) => role[name]).length > 0;
  }
}
