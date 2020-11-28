import { createAction, props } from '@ngrx/store';
import { NoteCM, NoteUM, NoteVM } from '@view-models';
const NoteActionType = {
  FIND: {
    FETCH: '[Note] Fetch Action',
    SUCCESS: '[Note] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Note] Create Action',
    SUCCESS: '[Note] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Note] Update Action',
    SUCCESS: '[Note] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Note] Remove Action',
    SUCCESS: '[Note] Remove Action Success',
  },
  RESET: {
    FETCH: '[Note] Reset Action',
  },
  ERROR: '[Note] Action Error',
};
const useFindAllAction = createAction(
  NoteActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  NoteActionType.FIND.SUCCESS,
  props<{ notes: NoteVM[], status: string }>()
);
const useCreateAction = createAction(
  NoteActionType.CREATE.FETCH,
  props<{ note: NoteCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  NoteActionType.CREATE.SUCCESS,
  props<{ note: NoteVM, status: string }>()
);
const useUpdateAction = createAction(
  NoteActionType.UPDATE.FETCH,
  props<{ note: NoteUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  NoteActionType.UPDATE.SUCCESS,
  props<{ note: NoteVM, status: string }>()
);
const useRemoveAction = createAction(
  NoteActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  NoteActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  NoteActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  NoteActionType.RESET.FETCH,
  props<{ notes: NoteVM[] }>()
);
export const NoteAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useCreateAction,
  useCreateSuccessAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useErrorAction,
  useResetAction
};
