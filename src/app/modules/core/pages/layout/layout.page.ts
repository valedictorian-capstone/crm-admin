import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AuthService, GlobalService } from '@services';
import { AccountVM } from '@view-models';

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
  ) {
    globalService.triggerView$.subscribe((context) => this.useDialog(context));
  }

  ngOnInit() {
    this.useSocket();
    this.useLoadMine();
  }
  useLoadMine = () => {
    this.authService.auth(undefined).subscribe((data) => {
      this.you = data;
      if (Math.min(...data.roles.map((e) => e.level)) <= 0) {
        this.canSetting = true;
      }
    });
  }
  useSocket = () => {
    this.authService.triggerValue$.subscribe((data) => {
      this.you = data;
      if (Math.min(...data.roles.map((e) => e.level)) <= 0) {
        this.canSetting = true;
      }
    });
  }
  useDialog(context: { type: string, payload: any }) {
    console.log(context);
    this.dialogService.open<{ type: string, payload: any }>(this.globalCreatRef, { closeOnBackdropClick: true, context });
  }
  useCheckRole = (name: string) => {
    return this.you.roles.filter((role) => role[name]).length > 0;
  }
}
