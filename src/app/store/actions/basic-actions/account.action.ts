import { createAction, props } from '@ngrx/store';
import { AccountVM } from '@view-models';
const FindAllAction = createAction(
  '[Account] Fetch Action',
  props<{
    success?: (res: AccountVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Account] Fetch Action Success',
  props<{ res: AccountVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Account] Save Success Action',
  props<{ res: AccountVM }>()
);
const RemoveSuccessAction = createAction(
  '[Account] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Account] Socket Action',
);
const ResetAction = createAction(
  '[Account] Reset Action',
);
export const AccountAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
