import { createAction, props } from '@ngrx/store';
import { CustomerCM, CustomerUM, CustomerVM } from '@view-models';
const FindAllAction = createAction(
  '[Customer] Fetch Action',
  props<{
    success?: (res: CustomerVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Customer] Fetch Action Success',
  props<{ res: CustomerVM[] }>()
);
const ImportSuccessAction = createAction(
  '[Customer] Import Success Action',
  props<{ res: CustomerVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Customer] Save Success Action',
  props<{ res: CustomerVM }>()
);
const ListAction = createAction(
  '[Customer] List Action',
  props<{ res: CustomerVM[] }>()
);
const ResetAction = createAction(
  '[Customer] Reset Action',
);
const SocketAction = createAction(
  '[Customer] Socket Action',
);
export const CustomerAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  ListAction,
  ImportSuccessAction,
  SocketAction,
  ResetAction
};
