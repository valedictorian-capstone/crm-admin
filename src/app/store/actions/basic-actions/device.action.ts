import { createAction, props } from '@ngrx/store';
import { DeviceCM, DeviceUM, DeviceVM } from '@view-models';
const FindAllAction = createAction(
  '[Device] Fetch Action',
  props<{
    success?: (res: DeviceVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Device] Fetch Action Success',
  props<{ res: DeviceVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Device] Save Success Action',
  props<{ res: DeviceVM }>()
);
const RemoveSuccessAction = createAction(
  '[Device] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Device] Socket Action',
);
const ResetAction = createAction(
  '[Device] Reset Action',
);
export const DeviceAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction
};
