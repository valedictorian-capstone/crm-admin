import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { GlobalService, NoteService } from '@services';
import { NoteVM } from '@view-models';
import { Subscription } from 'rxjs';

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
  ) { }
  useTogglePin = () => {
    this.subscriptions.push(
      this.noteService.update({ id: this.data.id, pin: !this.data.pin } as any).subscribe()
    );
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.subscriptions.push(
      this.noteService.remove(this.data.id).subscribe()
    );
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'note', payload: { note: this.data } });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
