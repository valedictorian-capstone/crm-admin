import { createAction, props } from '@ngrx/store';
import { ActivityCM, ActivityUM, ActivityVM } from '@view-models';
const ActivityActionType = {
  FIND: {
    FETCH: '[Activity] Fetch Action',
    SUCCESS: '[Activity] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Activity] Create Action',
    SUCCESS: '[Activity] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Activity] Update Action',
    SUCCESS: '[Activity] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Activity] Remove Action',
    SUCCESS: '[Activity] Remove Action Success',
  },
  RESET: {
    FETCH: '[Activity] Reset Action',
  },
  ERROR: '[Activity] Action Error',
};
const useFindAllAction = createAction(
  ActivityActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  ActivityActionType.FIND.SUCCESS,
  props<{ activitys: ActivityVM[], status: string }>()
);
const useCreateAction = createAction(
  ActivityActionType.CREATE.FETCH,
  props<{ activity: ActivityCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  ActivityActionType.CREATE.SUCCESS,
  props<{ activity: ActivityVM, status: string }>()
);
const useUpdateAction = createAction(
  ActivityActionType.UPDATE.FETCH,
  props<{ activity: ActivityUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  ActivityActionType.UPDATE.SUCCESS,
  props<{ activity: ActivityVM, status: string }>()
);
const useRemoveAction = createAction(
  ActivityActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  ActivityActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  ActivityActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  ActivityActionType.RESET.FETCH,
  props<{ activitys: ActivityVM[] }>()
);
export const ActivityAction = {
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
