import { createAction, props } from '@ngrx/store';
import { DealDetailCM, DealDetailUM, DealDetailVM } from '@view-models';
const DealDetailActionType = {
  FIND: {
    FETCH: '[DealDetail] Fetch Action',
    SUCCESS: '[DealDetail] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[DealDetail] Create Action',
    SUCCESS: '[DealDetail] Create Action Success',
  },
  UPDATE: {
    FETCH: '[DealDetail] Update Action',
    SUCCESS: '[DealDetail] Update Action Success',
  },
  REMOVE: {
    FETCH: '[DealDetail] Remove Action',
    SUCCESS: '[DealDetail] Remove Action Success',
  },
  RESET: {
    FETCH: '[DealDetail] Reset Action',
  },
  ERROR: '[DealDetail] Action Error',
};
const useFindAllAction = createAction(
  DealDetailActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  DealDetailActionType.FIND.SUCCESS,
  props<{ dealDetails: DealDetailVM[], status: string }>()
);
const useCreateAction = createAction(
  DealDetailActionType.CREATE.FETCH,
  props<{ dealDetail: DealDetailCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  DealDetailActionType.CREATE.SUCCESS,
  props<{ dealDetail: DealDetailVM, status: string }>()
);
const useUpdateAction = createAction(
  DealDetailActionType.UPDATE.FETCH,
  props<{ dealDetail: DealDetailUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  DealDetailActionType.UPDATE.SUCCESS,
  props<{ dealDetail: DealDetailVM, status: string }>()
);
const useRemoveAction = createAction(
  DealDetailActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  DealDetailActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  DealDetailActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  DealDetailActionType.RESET.FETCH,
  props<{ dealDetails: DealDetailVM[] }>()
);
export const DealDetailAction = {
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
