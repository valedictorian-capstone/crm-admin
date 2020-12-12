import { createAction, props } from '@ngrx/store';
import { StageCM, StageUM, StageVM } from '@view-models';
const FindAllAction = createAction(
  '[Stage] Fetch Action',
  props<{
    success?: (res: StageVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Stage] Fetch Action Success',
  props<{ res: StageVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Stage] Save Success Action',
  props<{ res: StageVM }>()
);
const RemoveSuccessAction = createAction(
  '[Stage] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Stage] Socket Action',
);
const ResetAction = createAction(
  '[Stage] Reset Action',
);
export const StageAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
