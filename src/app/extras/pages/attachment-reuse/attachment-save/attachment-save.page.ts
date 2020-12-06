import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AttachmentService } from '@services';
import { AttachmentVM, DealVM } from '@view-models';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-attachment-save',
  templateUrl: './attachment-save.page.html',
  styleUrls: ['./attachment-save.page.scss']
})
export class AttachmentSavePage implements OnInit, OnChanges {
  @Input() deal: DealVM;
  @Input() inside: boolean;
  @Input() fixDeal = false;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<AttachmentVM[]> = new EventEmitter<AttachmentVM[]>();
  form: FormGroup;
  files: NzUploadFile[] = [];
  constructor(
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly attachmentService: AttachmentService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }

  ngOnInit() {
    this.useInput();
    this.useHideSpinner();
  }
  ngOnChanges() {
    if (this.fixDeal && this.deal) {
      this.form.get('deal').setValue(this.deal);
    }
  }
  useInput = () => {
    if (this.fixDeal && this.deal) {
      this.form.get('deal').setValue(this.deal);
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.form.valid && this.files.length > 0) {
      this.useShowSpinner();
      const formData = new FormData();
      for (const file of this.files) {
        formData.append('files', file as any);
      }
      formData.append('deal', this.form.value.deal.id);
      this.attachmentService.insert(formData)
        .pipe(
          finalize(() => {
            this.useHideSpinner();
          })
        )
        .subscribe((data) => {
          this.toastrService.success('', 'Save attachment successful!', { duration: 3000 });
          this.useDone.emit(data);
          this.useClose.emit();
        }, (err) => {
          this.toastrService.danger('', 'Save attachment fail! Something wrong at runtime', { duration: 3000 });
        });
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useChange = (file: NzUploadFile) => {
    this.files = this.files.concat(file);
    return false;
  }
  useInitForm = () => {
    this.form = new FormGroup({
      deal: new FormControl(this.deal, [Validators.required]),
    });
  }
  useShowSpinner = () => {
    this.spinner.show('attachment-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('attachment-save');
    }, 1000);
  }
}
