import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { GlobalService, NoteService } from '@services';
import { NoteVM } from '@view-models';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-deal-note',
  templateUrl: './deal-note.component.html',
  styleUrls: ['./deal-note.component.scss']
})
export class DealNoteComponent implements OnInit {
  @Input() data: NoteVM;
  constructor(
    protected readonly noteService: NoteService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
  ) { }

  ngOnInit() {
  }

  useTogglePin = () => {
    this.noteService.update({ id: this.data.id, pin: !this.data.pin } as any).subscribe((data) => {
      this.noteService.triggerValue$.next({ type: 'update', data });
    });
  }
  useRemove = (ref: NbDialogRef<any>) => {
    ref.close();
    this.noteService.remove(this.data.id).subscribe(() => {
      this.noteService.triggerValue$.next({ type: 'remove', data: this.data });
    });
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'note', payload: { note: this.data } });
  }
}
