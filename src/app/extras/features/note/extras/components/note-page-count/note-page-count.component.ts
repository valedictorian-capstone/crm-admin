import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { INoteMainState } from '@extras/features/note';

@Component({
  selector: 'app-note-page-count',
  templateUrl: './note-page-count.component.html',
  styleUrls: ['./note-page-count.component.scss']
})
export class NotePageCountComponent {
  @Output() useSelectPageCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() state: INoteMainState;
}
