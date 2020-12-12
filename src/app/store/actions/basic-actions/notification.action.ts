import { createAction, props } from '@ngrx/store';
import { NotificationVM } from '@view-models';
const FindAllAction = createAction(
  '[Notification] Fetch Action',
  props<{
    success?: (res: NotificationVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Notification] Fetch Action Success',
  props<{ res: NotificationVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Notification] Save Success Action',
  props<{ res: NotificationVM }>()
);
const SeenAllSuccessAction = createAction(
  '[Notification] SeenAll Success Action',
  props<{ res: NotificationVM[] }>()
);
const SocketAction = createAction(
  '[Notification] Socket Action',
);
const ResetAction = createAction(
  '[Notification] Reset Action',
);
export const NotificationAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  SeenAllSuccessAction,
  SocketAction,
  ResetAction
};
