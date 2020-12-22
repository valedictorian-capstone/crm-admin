import { createAction, props } from '@ngrx/store';
import { EventUM, EventVM } from '@view-models';
const FindAllAction = createAction(
  '[Event] Fetch Action',
  props<{
    success?: (res: EventVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Event] Fetch Action Success',
  props<{ res: EventVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Event] Save Success Action',
  props<{ res: EventVM }>()
);
const RemoveSuccessAction = createAction(
  '[Event] Remove Success Action',
  props<{ id: string }>()
);
const ListAction = createAction(
  '[Event] List Action',
  props<{ res: EventVM[] }>()
);
const SocketAction = createAction(
  '[Event] Socket Action',
);
const ResetAction = createAction(
  '[Event] Reset Action',
);
export const EventAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  ListAction,
  SocketAction,
  ResetAction
};
