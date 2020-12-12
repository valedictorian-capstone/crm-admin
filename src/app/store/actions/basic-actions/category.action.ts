import { createAction, props } from '@ngrx/store';
import { CategoryCM, CategoryUM, CategoryVM } from '@view-models';
const FindAllAction = createAction(
  '[Category] Fetch Action',
  props<{
    success?: (res: CategoryVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Category] Fetch Action Success',
  props<{ res: CategoryVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Category] Save Success Action',
  props<{ res: CategoryVM }>()
);
const RemoveSuccessAction = createAction(
  '[Category] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Category] Socket Action',
);
const ResetAction = createAction(
  '[Category] Reset Action',
);
export const CategoryAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
