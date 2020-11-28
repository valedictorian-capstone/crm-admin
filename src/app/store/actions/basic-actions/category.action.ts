import { createAction, props } from '@ngrx/store';
import { CategoryCM, CategoryUM, CategoryVM } from '@view-models';
const CategoryActionType = {
  FIND: {
    FETCH: '[Category] Fetch Action',
    SUCCESS: '[Category] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Category] Create Action',
    SUCCESS: '[Category] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Category] Update Action',
    SUCCESS: '[Category] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Category] Remove Action',
    SUCCESS: '[Category] Remove Action Success',
  },
  RESET: {
    FETCH: '[Category] Reset Action',
  },
  ERROR: '[Category] Action Error',
};
const useFindAllAction = createAction(
  CategoryActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  CategoryActionType.FIND.SUCCESS,
  props<{ categorys: CategoryVM[], status: string }>()
);
const useCreateAction = createAction(
  CategoryActionType.CREATE.FETCH,
  props<{ category: CategoryCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  CategoryActionType.CREATE.SUCCESS,
  props<{ category: CategoryVM, status: string }>()
);
const useUpdateAction = createAction(
  CategoryActionType.UPDATE.FETCH,
  props<{ category: CategoryUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  CategoryActionType.UPDATE.SUCCESS,
  props<{ category: CategoryVM, status: string }>()
);
const useRemoveAction = createAction(
  CategoryActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  CategoryActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  CategoryActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  CategoryActionType.RESET.FETCH,
  props<{ categorys: CategoryVM[] }>()
);
export const CategoryAction = {
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
