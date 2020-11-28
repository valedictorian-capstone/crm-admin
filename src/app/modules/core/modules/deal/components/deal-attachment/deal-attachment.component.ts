import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AttachmentService } from '@services';
import { AttachmentVM } from '@view-models';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deal-attachment',
  templateUrl: './deal-attachment.component.html',
  styleUrls: ['./deal-attachment.component.scss']
})
export class DealAttachmentComponent implements OnInit {
  @Input() data: AttachmentVM;
  icon = 'image-outline';
  description = new FormControl('');
  constructor(
    protected readonly attachmentService: AttachmentService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.description.setValue(this.data.description);
    const images = ['png', 'jpg', 'jpeg', 'svg'];
    this.icon = images.includes(this.data.extension.split('/')[this.data.extension.split('/').length - 1]) ? 'image-outline' : 'file-outline';
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.attachmentService.remove(this.data.id).subscribe(() => {
      this.attachmentService.triggerValue$.next({ type: 'remove', data: [this.data] });
    });
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true, context: this.data });
  }
  useSave = (ref: NbDialogRef<any>) => {
    this.spinner.show('attachment-save');
    this.attachmentService.update({ id: this.data.id, description: this.description.value } as any)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.spinner.hide('attachment-save');
            ref.close();
          }, 1000);
        })
      )
      .subscribe(() => {
        (this.data as any).description = this.description.value;
        this.attachmentService.triggerValue$.next({ type: 'update', data: [this.data] });
      });
  }
}
