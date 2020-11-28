import { createAction, props } from '@ngrx/store';
import { PipelineCM, PipelineUM, PipelineVM } from '@view-models';
const PipelineActionType = {
  FIND: {
    FETCH: '[Pipeline] Fetch Action',
    SUCCESS: '[Pipeline] Fetch Action Success',
  },
  SAVE: {
    FETCH: '[Pipeline] Save Action',
    SUCCESS: '[Pipeline] Save Action Success',
  },
  REMOVE: {
    FETCH: '[Pipeline] Remove Action',
    SUCCESS: '[Pipeline] Remove Action Success',
  },
  RESET: {
    FETCH: '[Pipeline] Reset Action',
  },
  ERROR: '[Pipeline] Action Error',
};
const useFindAllAction = createAction(
  PipelineActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  PipelineActionType.FIND.SUCCESS,
  props<{ pipelines: PipelineVM[], status: string }>()
);
const useSaveAction = createAction(
  PipelineActionType.SAVE.FETCH,
  props<{ pipeline: PipelineCM | PipelineUM, status: string }>()
);
const useSaveSuccessAction = createAction(
  PipelineActionType.SAVE.SUCCESS,
  props<{ pipeline: PipelineVM, status: string }>()
);
const useRemoveAction = createAction(
  PipelineActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  PipelineActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  PipelineActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  PipelineActionType.RESET.FETCH,
  props<{ pipelines: PipelineVM[] }>()
);
export const PipelineAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useSaveAction,
  useSaveSuccessAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useErrorAction,
  useResetAction
};
