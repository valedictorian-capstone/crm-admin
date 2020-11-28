import { createAction, props } from '@ngrx/store';
import { RoleCM, RoleUM, RoleVM } from '@view-models';
const RoleActionType = {
  FIND: {
    FETCH: '[Role] Fetch Action',
    SUCCESS: '[Role] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Role] Create Action',
    SUCCESS: '[Role] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Role] Update Action',
    SUCCESS: '[Role] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Role] Remove Action',
    SUCCESS: '[Role] Remove Action Success',
  },
  RESET: {
    FETCH: '[Role] Reset Action',
  },
  ERROR: '[Role] Action Error',
};
const useFindAllAction = createAction(
  RoleActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  RoleActionType.FIND.SUCCESS,
  props<{ roles: RoleVM[], status: string }>()
);
const useCreateAction = createAction(
  RoleActionType.CREATE.FETCH,
  props<{ role: RoleCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  RoleActionType.CREATE.SUCCESS,
  props<{ role: RoleVM, status: string }>()
);
const useUpdateAction = createAction(
  RoleActionType.UPDATE.FETCH,
  props<{ role: RoleUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  RoleActionType.UPDATE.SUCCESS,
  props<{ role: RoleVM, status: string }>()
);
const useRemoveAction = createAction(
  RoleActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  RoleActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  RoleActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  RoleActionType.RESET.FETCH,
  props<{ roles: RoleVM[] }>()
);
export const RoleAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useCreateAction,
  useCreateSuccessAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useErrorAction,
  useResetAction
};
