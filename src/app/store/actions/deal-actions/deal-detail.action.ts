import { createAction, props } from '@ngrx/store';
import { DealDetailCM, DealDetailUM, DealDetailVM } from '@view-models';
const FindAllAction = createAction(
  '[DealDetail] Fetch Action',
  props<{
    success?: (res: DealDetailVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[DealDetail] Fetch Action Success',
  props<{ res: DealDetailVM[] }>()
);
const SaveSuccessAction = createAction(
  '[DealDetail] Save Success Action',
  props<{ res: DealDetailVM }>()
);
const RemoveSuccessAction = createAction(
  '[DealDetail] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[DealDetail] Socket Action',
);
const ListAction = createAction(
  '[DealDetail] List Action',
  props<{ res: DealDetailVM[] }>()
);
const ResetAction = createAction(
  '[DealDetail] Reset Action',
);
export const DealDetailAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ListAction,
  ResetAction
};
