import { createAction, props } from '@ngrx/store';
import { LogVM } from '@view-models';
const FindAllAction = createAction(
  '[Log] Fetch Action',
  props<{
    success?: (res: LogVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Log] Fetch Action Success',
  props<{ res: LogVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Log] Save Success Action',
  props<{ res: LogVM }>()
);
const RemoveSuccessAction = createAction(
  '[Log] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Log] Socket Action',
);
const ListAction = createAction(
  '[Log] List Action',
  props<{ res: LogVM[] }>()
);
const ResetAction = createAction(
  '[Log] Reset Action',
);
export const LogAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ListAction,
  ResetAction
};
