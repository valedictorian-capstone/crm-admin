import { createAction, props } from '@ngrx/store';
import { StageCM, StageUM, StageVM } from '@view-models';
const StageActionType = {
  FIND: {
    FETCH: '[Stage] Fetch Action',
    SUCCESS: '[Stage] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Stage] Create Action',
    SUCCESS: '[Stage] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Stage] Update Action',
    SUCCESS: '[Stage] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Stage] Remove Action',
    SUCCESS: '[Stage] Remove Action Success',
  },
  RESET: {
    FETCH: '[Stage] Reset Action',
  },
  ERROR: '[Stage] Action Error',
};
const useFindAllAction = createAction(
  StageActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  StageActionType.FIND.SUCCESS,
  props<{ stages: StageVM[], status: string }>()
);
const useCreateAction = createAction(
  StageActionType.CREATE.FETCH,
  props<{ stage: StageCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  StageActionType.CREATE.SUCCESS,
  props<{ stage: StageVM, status: string }>()
);
const useUpdateAction = createAction(
  StageActionType.UPDATE.FETCH,
  props<{ stage: StageUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  StageActionType.UPDATE.SUCCESS,
  props<{ stage: StageVM, status: string }>()
);
const useRemoveAction = createAction(
  StageActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  StageActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  StageActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  StageActionType.RESET.FETCH,
  props<{ stages: StageVM[] }>()
);
export const StageAction = {
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
