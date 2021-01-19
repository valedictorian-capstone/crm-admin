import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
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
  form: FormGroup;
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
export class AttachmentSaveModal implements OnInit, OnChanges, OnDestroy {
  @Input() payload: IAttachmentSavePagePayload = {
    deal: undefined,
    campaign: undefined,
    inside: false,
    fix: false,
    for: 'deal'
  };
  state: IAttachmentSavePageState = {
    form: undefined,
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
    this.useInitForm();
  }

  ngOnInit() {
    this.useInput();
    if (this.payload.for) {
      this.state.form.get('for').setValue(this.payload.for);
    }
  }
  ngOnChanges() {
    this.useInput();
  }
  useInput = () => {
    this.state.form.get('deal').setValue(this.payload.deal);
    this.state.form.get('campaign').setValue(this.payload.campaign);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.state.form.valid && this.state.files.length > 0) {
      this.useShowSpinner();
      const formData = new FormData();
      for (const file of this.state.files) {
        formData.append('files', file as any);
      }
      formData.append(this.state.form.value.for, this.state.form.value[this.state.form.value.for].id);
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
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useChange = (file: NzUploadFile) => {
    this.state.files = this.state.files.concat(file);
    return false;
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      for: new FormControl('deal'),
      deal: new FormControl(undefined, [Validators.required]),
      campaign: new FormControl(undefined, []),
    });
    this.subscriptions.push(
      this.state.form.get('for').valueChanges
        .pipe(
          tap((data) => {
            this.state.form.get('deal').setValidators([]);
            this.state.form.get('deal').setErrors(null);
            this.state.form.get('campaign').setValidators([]);
            this.state.form.get('campaign').setErrors(null);
            switch (data) {
              case 'deal':
                this.state.form.get('deal').setValidators([Validators.required]);
                break;
              case 'campaign':
                this.state.form.get('campaign').setValidators([Validators.required]);
                break;
              default:
                break;
            }
          })
        ).subscribe()
    );
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
