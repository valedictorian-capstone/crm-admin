import { createAction, props } from '@ngrx/store';
import { GroupVM } from '@view-models';
const FindAllAction = createAction(
  '[Group] Fetch Action',
  props<{
    success?: (res: GroupVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Group] Fetch Action Success',
  props<{ res: GroupVM[] }>()
);
const ResetAction = createAction(
  '[Group] Reset Action',
);
export const GroupAction = {
  FindAllAction,
  FindAllSuccessAction,
  ResetAction
};
