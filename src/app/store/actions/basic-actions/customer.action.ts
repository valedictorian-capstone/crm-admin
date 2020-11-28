import { createAction, props } from '@ngrx/store';
import { CustomerCM, CustomerUM, CustomerVM } from '@view-models';
const CustomerActionType = {
  FIND: {
    FETCH: '[Customer] Fetch Action',
    SUCCESS: '[Customer] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Customer] Create Action',
    SUCCESS: '[Customer] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Customer] Update Action',
    SUCCESS: '[Customer] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Customer] Remove Action',
    SUCCESS: '[Customer] Remove Action Success',
  },
  UNIQUE: {
    FETCH: '[Customer] Unique Action',
    SUCCESS: '[Customer] Unique Action Success',
  },
  RESET: {
    FETCH: '[Customer] Reset Action',
  },
  ERROR: '[Customer] Action Error'
};
const useFindAllAction = createAction(
  CustomerActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  CustomerActionType.FIND.SUCCESS,
  props<{ customers: CustomerVM[], status: string }>()
);
const useCreateAction = createAction(
  CustomerActionType.CREATE.FETCH,
  props<{ customer: CustomerCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  CustomerActionType.CREATE.SUCCESS,
  props<{ customer: CustomerVM, status: string }>()
);
const useUpdateAction = createAction(
  CustomerActionType.UPDATE.FETCH,
  props<{ customer: CustomerUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  CustomerActionType.UPDATE.SUCCESS,
  props<{ customer: CustomerVM, status: string }>()
);
const useRemoveAction = createAction(
  CustomerActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  CustomerActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useUniqueAction = createAction(
  CustomerActionType.REMOVE.FETCH,
  props<{ data: { label: string, value: string }, status: string }>()
);
const useUniqueSuccessAction = createAction(
  CustomerActionType.REMOVE.SUCCESS,
  props<{ result: boolean, status: string }>()
);
const useErrorAction = createAction(
  CustomerActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  CustomerActionType.RESET.FETCH,
  props<{ customers: CustomerVM[] }>()
);
export const CustomerAction = {
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
