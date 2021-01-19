import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, Output, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { AttachmentService, GlobalService } from '@services';
import { AttachmentVM, CampaignVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-attachment-card-item',
  templateUrl: './attachment-card-item.component.html',
  styleUrls: ['./attachment-card-item.component.scss']
})
export class AttachmentCardItemComponent implements OnDestroy, OnInit {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() attachment: AttachmentVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() search: string;
  @Input() stage: string;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  icon = 'image-outline';
  form: FormGroup;
  description = new FormControl('');
  exist = {
    email: false,
    phone: false,
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly dialogService: NbDialogService,
    protected readonly service: AttachmentService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  ngOnInit() {
    console.log(this.attachment);
    if (this.attachment) {
      this.description.setValue(this.attachment.description);
    const images = ['png', 'jpg', 'jpeg', 'svg'];
    this.icon = images.includes(this.attachment.extension.split('/')[this.attachment.extension.split('/').length - 1]) ? 'image-outline' : 'file-outline';
    }
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'attachment', payload: { attachment: this.attachment, for: this.attachment.campaign ? 'campaign' : (this.attachment.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
  }
  useCopy(data: string) {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useDownload() {
    window.open(this.attachment.url, '_blank');
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true, context: this.attachment });
  }
  useSave = (ref: NbDialogRef<any>) => {
    this.spinner.show('attachment-save');
    this.subscriptions.push(
      this.service.update({ id: this.attachment.id, description: this.description.value } as any)
        .pipe(
          tap((data) => {
            this.attachment.description = this.description.value;
            this.toastrService.show('', 'Save attachment success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });

          }),
          finalize(() => {
            this.spinner.hide('attachment-save');
            ref.close();
          })
        )
        .subscribe()
    );
  }
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
