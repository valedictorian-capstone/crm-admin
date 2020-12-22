import { createAction, props } from '@ngrx/store';
import { CommentVM } from '@view-models';
const FindAllAction = createAction(
  '[Comment] Fetch Action',
  props<{
    success?: (res: CommentVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Comment] Fetch Action Success',
  props<{ res: CommentVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Comment] Save Success Action',
  props<{ res: CommentVM }>()
);
const RemoveSuccessAction = createAction(
  '[Comment] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Comment] Socket Action',
);
const ListAction = createAction(
  '[Comment] List Action',
  props<{ res: CommentVM[] }>()
);
const ResetAction = createAction(
  '[Comment] Reset Action',
);
export const CommentAction = {
  FindAllAction,
  FindAllSuccessAction,
  ListAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
