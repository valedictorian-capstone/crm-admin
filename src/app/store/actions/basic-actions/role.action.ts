import { createAction, props } from '@ngrx/store';
import { RoleCM, RoleUM, RoleVM } from '@view-models';
const FindAllAction = createAction(
  '[Role] Fetch Action',
  props<{
    success?: (res: RoleVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Role] Fetch Action Success',
  props<{ res: RoleVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Role] Save Success Action',
  props<{ res: RoleVM }>()
);
const RemoveSuccessAction = createAction(
  '[Role] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Role] Socket Action',
);
const ListAction = createAction(
  '[Role] List Action',
  props<{ res: RoleVM[] }>()
);
const ResetAction = createAction(
  '[Role] Reset Action',
);
export const RoleAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  ListAction,
  SocketAction,
  ResetAction
};
