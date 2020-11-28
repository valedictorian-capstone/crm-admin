import { createAction, props } from '@ngrx/store';
import { DeviceCM, DeviceUM, DeviceVM } from '@view-models';
const DeviceActionType = {
  FIND: {
    FETCH: '[Device] Fetch Action',
    SUCCESS: '[Device] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Device] Create Action',
    SUCCESS: '[Device] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Device] Update Action',
    SUCCESS: '[Device] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Device] Remove Action',
    SUCCESS: '[Device] Remove Action Success',
  },
  RESET: {
    FETCH: '[Device] Reset Action',
  },
  ERROR: '[Device] Action Error',
};
const useFindAllAction = createAction(
  DeviceActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  DeviceActionType.FIND.SUCCESS,
  props<{ devices: DeviceVM[], status: string }>()
);
const useCreateAction = createAction(
  DeviceActionType.CREATE.FETCH,
  props<{ device: DeviceCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  DeviceActionType.CREATE.SUCCESS,
  props<{ device: DeviceVM, status: string }>()
);
const useUpdateAction = createAction(
  DeviceActionType.UPDATE.FETCH,
  props<{ device: DeviceUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  DeviceActionType.UPDATE.SUCCESS,
  props<{ device: DeviceVM, status: string }>()
);
const useRemoveAction = createAction(
  DeviceActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  DeviceActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  DeviceActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  DeviceActionType.RESET.FETCH,
  props<{ devices: DeviceVM[] }>()
);
export const DeviceAction = {
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
