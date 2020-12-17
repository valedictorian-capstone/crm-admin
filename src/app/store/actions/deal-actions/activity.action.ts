import { createAction, props } from '@ngrx/store';
import { AccountVM, ActivityCM, ActivityUM, ActivityVM } from '@view-models';
const FindAllAction = createAction(
  '[Activity] Fetch Action',
  props<{
    success?: (res: ActivityVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Activity] Fetch Action Success',
  props<{ res: ActivityVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Activity] Save Success Action',
  props<{ res: ActivityVM }>()
);
const RemoveSuccessAction = createAction(
  '[Activity] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Activity] Socket Action',
  props<{ requester: AccountVM }>()
);
const ListAction = createAction(
  '[Activity] List Action',
  props<{ res: ActivityVM[] }>()
);
const ResetAction = createAction(
  '[Activity] Reset Action',
);
export const ActivityAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction,
  ListAction
};
