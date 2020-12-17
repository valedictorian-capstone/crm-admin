import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { GlobalService, NoteService } from '@services';
import { NoteVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deal-note',
  templateUrl: './deal-note.component.html',
  styleUrls: ['./deal-note.component.scss']
})
export class DealNoteComponent implements OnDestroy {
  @Input() data: NoteVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly noteService: NoteService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) { }
  useTogglePin = () => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.noteService.update({ id: this.data.id, pin: !this.data.pin } as any)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.useShowSpinner();
    this.subscriptions.push(
      this.noteService.remove(this.data.id)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
    );
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'note', payload: { note: this.data } });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-note-' + this.data.id);
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-note-' + this.data.id);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
