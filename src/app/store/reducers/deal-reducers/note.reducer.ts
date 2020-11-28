import { NoteAction } from '@actions';
import { noteAdapter, noteInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { NoteState } from '@states';
export const noteFeatureKey = 'note';
export const noteReducer = createReducer(
  noteInitialState,
  on(NoteAction.useFindAllAction,
    (state, action) => noteAdapter.setAll<NoteState>([], {
      ...state,
      status: action.status
    })
  ),
  on(NoteAction.useFindAllSuccessAction,
    (state, action) => noteAdapter.setAll<NoteState>(action.notes, {
      ...state,
      status: action.status
    })
  ),
  on(NoteAction.useUpdateAction,
    (state, action) => noteAdapter.setOne<NoteState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(NoteAction.useUpdateSuccessAction,
    (state, action) => noteAdapter.updateOne<NoteState>({
      id: action.note.id,
      changes: action.note
    }, state)
  ),
  on(NoteAction.useCreateAction,
    (state, action) => noteAdapter.setOne<NoteState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(NoteAction.useCreateSuccessAction,
    (state, action) => noteAdapter.addOne<NoteState>(action.note, state)
  ),
  on(NoteAction.useRemoveAction,
    (state, action) => noteAdapter.setOne<NoteState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(NoteAction.useRemoveSuccessAction,
    (state, action) => noteAdapter.removeOne<NoteState>(action.id, state)
  ),
  on(NoteAction.useResetAction,
    (state, action) => noteAdapter.setAll<NoteState>(action.notes, noteInitialState)
  ),
  on(NoteAction.useErrorAction,
    (state, action) => noteAdapter.setOne<NoteState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
