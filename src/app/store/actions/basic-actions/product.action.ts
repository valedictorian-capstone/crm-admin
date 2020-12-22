import { createAction, props } from '@ngrx/store';
import { ProductCM, ProductUM, ProductVM } from '@view-models';
const FindAllAction = createAction(
  '[Product] Fetch Action',
  props<{
    success?: (res: ProductVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Product] Fetch Action Success',
  props<{ res: ProductVM[] }>()
);
const ImportSuccessAction = createAction(
  '[Product] Import Success Action',
  props<{ res: ProductVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Product] Save Success Action',
  props<{ res: ProductVM }>()
);
const RemoveSuccessAction = createAction(
  '[Product] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Product] Socket Action',
);
const ResetAction = createAction(
  '[Product] Reset Action',
);
export const ProductAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  ImportSuccessAction,
  SocketAction,
  ResetAction
};
