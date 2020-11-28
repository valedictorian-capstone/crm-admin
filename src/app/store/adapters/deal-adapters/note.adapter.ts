import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { NoteState } from '@states';
import { NoteVM } from '@view-models';
export const noteAdapter: EntityAdapter<NoteVM> = createEntityAdapter<NoteVM>();

export const noteInitialState: NoteState = noteAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
