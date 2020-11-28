import { createAction, props } from '@ngrx/store';
import { DealCM, DealUM, DealVM } from '@view-models';
const DealActionType = {
  FIND: {
    FETCH: '[Deal] Fetch Action',
    SUCCESS: '[Deal] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Deal] Create Action',
    SUCCESS: '[Deal] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Deal] Update Action',
    SUCCESS: '[Deal] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Deal] Remove Action',
    SUCCESS: '[Deal] Remove Action Success',
  },
  RESET: {
    FETCH: '[Deal] Reset Action',
  },
  ERROR: '[Deal] Action Error',
};
const useFindAllAction = createAction(
  DealActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  DealActionType.FIND.SUCCESS,
  props<{ deals: DealVM[], status: string }>()
);
const useCreateAction = createAction(
  DealActionType.CREATE.FETCH,
  props<{ deal: DealCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  DealActionType.CREATE.SUCCESS,
  props<{ deal: DealVM, status: string }>()
);
const useUpdateAction = createAction(
  DealActionType.UPDATE.FETCH,
  props<{ deal: DealUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  DealActionType.UPDATE.SUCCESS,
  props<{ deal: DealVM, status: string }>()
);
const useRemoveAction = createAction(
  DealActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  DealActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  DealActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  DealActionType.RESET.FETCH,
  props<{ deals: DealVM[] }>()
);
export const DealAction = {
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
