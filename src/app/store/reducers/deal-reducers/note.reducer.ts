import { createReducer, on } from '@ngrx/store';
import { noteAdapter, noteInitialState } from '@adapters';
import { NoteAction } from '@actions';
import { NoteState } from '@states';
export const noteFeatureKey = 'note';
export const noteReducer = createReducer(
  noteInitialState,
  on(NoteAction.FindAllSuccessAction,
    (state, action) => noteAdapter.setAll<NoteState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(NoteAction.FindAllSuccessAction,
    (state, action) => noteAdapter.setAll<NoteState>(action.res, {
      ...state,
    })
  ),
  on(NoteAction.SaveSuccessAction,
    (state, action) => noteAdapter.upsertOne<NoteState>(action.res, {
      ...state,
    })
  ),
  on(NoteAction.RemoveSuccessAction,
    (state, action) => noteAdapter.removeOne<NoteState>(action.id, {
      ...state,
    })
  ),
  on(NoteAction.ResetAction,
    () => noteAdapter.setAll<NoteState>([], noteInitialState)
  ),
);
