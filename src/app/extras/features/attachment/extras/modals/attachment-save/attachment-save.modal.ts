import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AttachmentService } from '@services';
import { State } from '@store/states';
import { AttachmentVM, CampaignVM, DealVM } from '@view-models';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface IAttachmentSavePageState {
  files: NzUploadFile[];
}

interface IAttachmentSavePagePayload {
  deal: DealVM;
  campaign: CampaignVM;
  inside: boolean;
  fix: boolean;
  for: 'campaign' | 'deal'
}

@Component({
  selector: 'app-attachment-save',
  templateUrl: './attachment-save.modal.html',
  styleUrls: ['./attachment-save.modal.scss']
})
export class AttachmentSaveModal implements  OnDestroy {
  @Input() payload: IAttachmentSavePagePayload = {
    deal: undefined,
    campaign: undefined,
    inside: false,
    fix: false,
    for: 'deal'
  };
  state: IAttachmentSavePageState = {
    files: [],
  }
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<AttachmentVM[]> = new EventEmitter<AttachmentVM[]>();
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly attachmentService: AttachmentService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.state.files.length > 0) {
      this.useShowSpinner();
      const formData = new FormData();
      for (const file of this.state.files) {
        formData.append('files', file as any);
      }
      if (this.payload.deal) {
        formData.append('deal', this.payload.deal.id);
      }
      if (this.payload.campaign) {
        formData.append('campaign', this.payload.campaign.id);
      }
      const subscription = this.attachmentService.insert(formData)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Save attachment successful!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save attachment fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe();
      this.subscriptions.push(subscription);
    }
  }
  useChange = (file: NzUploadFile) => {
    this.state.files = this.state.files.concat(file);
    return false;
  }
  useShowSpinner = () => {
    this.spinner.show('attachment-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('attachment-save');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
