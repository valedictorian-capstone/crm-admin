import { createAction, props } from '@ngrx/store';
import { GroupCM, GroupUM, GroupVM } from '@view-models';
const GroupActionType = {
  FIND: {
    FETCH: '[Group] Fetch Action',
    SUCCESS: '[Group] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Group] Create Action',
    SUCCESS: '[Group] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Group] Update Action',
    SUCCESS: '[Group] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Group] Remove Action',
    SUCCESS: '[Group] Remove Action Success',
  },
  RESET: {
    FETCH: '[Group] Reset Action',
  },
  ERROR: '[Group] Action Error',
};
const useFindAllAction = createAction(
  GroupActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  GroupActionType.FIND.SUCCESS,
  props<{ groups: GroupVM[], status: string }>()
);
const useCreateAction = createAction(
  GroupActionType.CREATE.FETCH,
  props<{ group: GroupCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  GroupActionType.CREATE.SUCCESS,
  props<{ group: GroupVM, status: string }>()
);
const useUpdateAction = createAction(
  GroupActionType.UPDATE.FETCH,
  props<{ group: GroupUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  GroupActionType.UPDATE.SUCCESS,
  props<{ group: GroupVM, status: string }>()
);
const useRemoveAction = createAction(
  GroupActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  GroupActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  GroupActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  GroupActionType.RESET.FETCH,
  props<{ groups: GroupVM[] }>()
);
export const GroupAction = {
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
