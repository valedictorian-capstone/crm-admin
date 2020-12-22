import { createAction, props } from '@ngrx/store';
import { PipelineUM, PipelineVM } from '@view-models';
const FindAllAction = createAction(
  '[Pipeline] Fetch Action',
  props<{
    success?: (res: PipelineVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Pipeline] Fetch Action Success',
  props<{ res: PipelineVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Pipeline] Save Success Action',
  props<{ res: PipelineVM }>()
);
const RemoveSuccessAction = createAction(
  '[Pipeline] Remove Success Action',
  props<{ id: string }>()
);
const ListAction = createAction(
  '[Pipeline] List Action',
  props<{ res: PipelineVM[] }>()
);
const SocketAction = createAction(
  '[Pipeline] Socket Action',
);
const ResetAction = createAction(
  '[Pipeline] Reset Action',
);
export const PipelineAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ListAction,
  ResetAction
};
