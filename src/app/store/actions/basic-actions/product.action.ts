import { createAction, props } from '@ngrx/store';
import { ProductCM, ProductUM, ProductVM } from '@view-models';
const ProductActionType = {
  FIND: {
    FETCH: '[Product] Fetch Action',
    SUCCESS: '[Product] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Product] Create Action',
    SUCCESS: '[Product] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Product] Update Action',
    SUCCESS: '[Product] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Product] Remove Action',
    SUCCESS: '[Product] Remove Action Success',
  },
  UNIQUE: {
    FETCH: '[Product] Unique Action',
    SUCCESS: '[Product] Unique Action Success',
  },
  RESET: {
    FETCH: '[Product] Reset Action',
  },
  ERROR: '[Product] Action Error'
};
const useFindAllAction = createAction(
  ProductActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  ProductActionType.FIND.SUCCESS,
  props<{ products: ProductVM[], status: string }>()
);
const useCreateAction = createAction(
  ProductActionType.CREATE.FETCH,
  props<{ product: ProductCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  ProductActionType.CREATE.SUCCESS,
  props<{ product: ProductVM, status: string }>()
);
const useUpdateAction = createAction(
  ProductActionType.UPDATE.FETCH,
  props<{ product: ProductUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  ProductActionType.UPDATE.SUCCESS,
  props<{ product: ProductVM, status: string }>()
);
const useRemoveAction = createAction(
  ProductActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  ProductActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useUniqueAction = createAction(
  ProductActionType.REMOVE.FETCH,
  props<{ data: { label: string, value: string }, status: string }>()
);
const useUniqueSuccessAction = createAction(
  ProductActionType.REMOVE.SUCCESS,
  props<{ result: boolean, status: string }>()
);
const useErrorAction = createAction(
  ProductActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  ProductActionType.RESET.FETCH,
  props<{ products: ProductVM[] }>()
);
export const ProductAction = {
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
