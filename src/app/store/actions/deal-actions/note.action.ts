import { createAction, props } from '@ngrx/store';
import { NoteCM, NoteUM, NoteVM } from '@view-models';
const FindAllAction = createAction(
  '[Note] Fetch Action',
  props<{
    success?: (res: NoteVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Note] Fetch Action Success',
  props<{ res: NoteVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Note] Save Success Action',
  props<{ res: NoteVM }>()
);
const RemoveSuccessAction = createAction(
  '[Note] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Note] Socket Action',
);
const ResetAction = createAction(
  '[Note] Reset Action',
);
export const NoteAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
