import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { GlobalService } from '@services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})
export class LayoutPage implements OnInit {
  @ViewChild('globalCreatRef') globalCreatRef: TemplateRef<any>;
  constructor(
    protected readonly dialogService: NbDialogService,
    protected readonly globalService: GlobalService,
  ) {
    globalService.triggerView$.subscribe((context) => this.useDialog(context));
  }

  ngOnInit() {
  }

  useDialog(context: { type: string, payload: any }) {
    console.log(context.payload);
    this.dialogService.open<{ type: string, payload: any }>(this.globalCreatRef, { closeOnBackdropClick: true, context });
  }
}
