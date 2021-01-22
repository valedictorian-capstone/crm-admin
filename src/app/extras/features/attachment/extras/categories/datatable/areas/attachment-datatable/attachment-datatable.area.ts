import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { IAttachmentMainState } from '@extras/features/attachment';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { AttachmentService } from '@services';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of, Subscription } from 'rxjs';
import { AttachmentVM, CampaignVM, DealVM } from '@view-models';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-attachment-datatable',
  templateUrl: './attachment-datatable.area.html',
  styleUrls: ['./attachment-datatable.area.scss']
})
export class AttachmentDatatableArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, attachment: AttachmentVM}[]> = new EventEmitter<{formControl: FormControl, attachment: AttachmentVM}[]>();
  headerCheck = new FormControl('off');
  checkList: {formControl: FormControl, attachment: AttachmentVM}[] = [];
  @Input() state: IAttachmentMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AttachmentService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.headerCheck.setValue('off');
    console.log(this.state);
    this.checkList = this.state.paginationArray.map((attachment) => ({
      attachment,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an attachment?',
      text: 'When you click OK button, an attachment will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove attachment successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove attachment fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  useItemCheck(isHeader: boolean) {
    if (isHeader) {
      const value = this.headerCheck.value === 'on';
      this.checkList = this.state.paginationArray.map((attachment) => ({
        attachment,
        formControl: new FormControl(value),
      }))
    } else {
      const size = this.checkList.filter((e) => e.formControl.value).length;
      this.headerCheck.setValue(size > 0 ? (size === this.checkList.length ? 'on' : 'indeterminate') : 'off');
    }
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
