import { createAction, props } from '@ngrx/store';
import { AccountCM, AccountUM, AccountVM } from '@view-models';
const AccountActionType = {
  FIND: {
    FETCH: '[Account] Fetch Action',
    SUCCESS: '[Account] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Account] Create Action',
    SUCCESS: '[Account] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Account] Update Action',
    SUCCESS: '[Account] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Account] Remove Action',
    SUCCESS: '[Account] Remove Action Success',
  },
  UNIQUE: {
    FETCH: '[Account] Unique Action',
    SUCCESS: '[Account] Unique Action Success',
  },
  RESET: {
    FETCH: '[Account] Reset Action',
  },
  ERROR: '[Account] Action Error'
};
const useFindAllAction = createAction(
  AccountActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  AccountActionType.FIND.SUCCESS,
  props<{ accounts: AccountVM[], status: string }>()
);
const useCreateAction = createAction(
  AccountActionType.CREATE.FETCH,
  props<{ account: AccountCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  AccountActionType.CREATE.SUCCESS,
  props<{ account: AccountVM, status: string }>()
);
const useUpdateAction = createAction(
  AccountActionType.UPDATE.FETCH,
  props<{ account: AccountUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  AccountActionType.UPDATE.SUCCESS,
  props<{ account: AccountVM, status: string }>()
);
const useRemoveAction = createAction(
  AccountActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  AccountActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useUniqueAction = createAction(
  AccountActionType.REMOVE.FETCH,
  props<{ data: { label: string, value: string }, status: string }>()
);
const useUniqueSuccessAction = createAction(
  AccountActionType.REMOVE.SUCCESS,
  props<{ result: boolean, status: string }>()
);
const useErrorAction = createAction(
  AccountActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  AccountActionType.RESET.FETCH,
  props<{ accounts: AccountVM[] }>()
);
export const AccountAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useCreateAction,
  useCreateSuccessAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useUniqueAction,
  useUniqueSuccessAction,
  useErrorAction,
  useResetAction
};
