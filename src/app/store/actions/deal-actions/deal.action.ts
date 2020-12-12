import { createAction, props } from '@ngrx/store';
import { DealCM, DealUM, DealVM } from '@view-models';
const FindAllAction = createAction(
  '[Deal] Fetch Action',
  props<{
    success?: (res: DealVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Deal] Fetch Action Success',
  props<{ res: DealVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Deal] Save Success Action',
  props<{ res: DealVM }>()
);
const RemoveSuccessAction = createAction(
  '[Deal] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Deal] Socket Action',
);
const ResetAction = createAction(
  '[Deal] Reset Action',
);
export const DealAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
