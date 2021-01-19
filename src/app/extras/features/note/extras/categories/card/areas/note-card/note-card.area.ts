import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { INoteMainState } from '@extras/features/note';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { NoteService } from '@services';
import { CampaignVM, DealVM, NoteVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.area.html',
  styleUrls: ['./note-card.area.scss']
})
export class NoteCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, note: NoteVM}[]> = new EventEmitter<{formControl: FormControl, note: NoteVM}[]>();
  @Input() state: INoteMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() for: 'deal' | 'campaign';
  checkList: {formControl: FormControl, note: NoteVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: NoteService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.checkList = this.state.paginationArray.map((note) => ({
      note,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck() {
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an note?',
      text: 'When you click OK button, an note will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove note successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove note fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
