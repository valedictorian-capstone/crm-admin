import { AccountVM, NoteVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface INoteMainState {
  array: NoteVM[];
  filterArray: NoteVM[];
  paginationArray: NoteVM[];
  you?: AccountVM;
  show: boolean,
  type: 'card' | 'datatable' | 'calendar';
  max?: number;
  pageCount: number;
  active?: FormControl;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface INoteDetailState {
  id: string;
  main: NoteVM;
  you?: AccountVM;
}
