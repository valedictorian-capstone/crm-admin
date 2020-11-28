import { createAction, props } from '@ngrx/store';
import { DeviceCM, DeviceUM, DeviceVM } from '@view-models';
const DeviceActionType = {
  FIND: {
    FETCH: '[Device] Fetch Actions',
    SUCCESS: '[Device] Fetch Actions Success',
    ERROR: '[Device] Fetch Actions Error',
  },
  CREATE: {
    FETCH: '[Device] Create Actions',
    SUCCESS: '[Device] Create Actions Success',
    ERROR: '[Device] Create Actions Error',
  },
  UPDATE: {
    FETCH: '[Device] Update Actions',
    SUCCESS: '[Device] Update Actions Success',
    ERROR: '[Device] Update Actions Error',
  },
  REMOVE: {
    FETCH: '[Device] Remove Actions',
    SUCCESS: '[Device] Remove Actions Success',
    ERROR: '[Device] Remove Actions Error',
  },
  UNIQUE: {
    FETCH: '[Device] Unique Actions',
    SUCCESS: '[Device] Unique Actions Success',
    ERROR: '[Device] Unique Actions Error',
  },
  RESET: {
    FETCH: '[Device] Reset Actions',
  },
};
const useFindAllAction = createAction(
  DeviceActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  DeviceActionType.FIND.SUCCESS,
  props<{ devices: DeviceVM[], status: string }>()
);
const useFindAllErrorAction = createAction(
  DeviceActionType.FIND.ERROR,
  props<{ error: string, status: string }>()
);
const useCreateAction = createAction(
  DeviceActionType.CREATE.FETCH,
  props<{ device: DeviceCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  DeviceActionType.CREATE.SUCCESS,
  props<{ device: DeviceVM, status: string }>()
);
const useCreateErrorAction = createAction(
  DeviceActionType.CREATE.ERROR,
  props<{ error: string, status: string }>()
);
const useUpdateAction = createAction(
  DeviceActionType.UPDATE.FETCH,
  props<{ device: DeviceUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  DeviceActionType.UPDATE.SUCCESS,
  props<{ device: DeviceVM, status: string }>()
);
const useUpdateErrorAction = createAction(
  DeviceActionType.UPDATE.ERROR,
  props<{ error: string, status: string }>()
);
const useRemoveAction = createAction(
  DeviceActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  DeviceActionType.REMOVE.SUCCESS,
  props<{ message: string, status: string }>()
);
const useRemoveErrorAction = createAction(
  DeviceActionType.REMOVE.ERROR,
  props<{ error: string, status: string }>()
);
const useUniqueAction = createAction(
  DeviceActionType.REMOVE.FETCH,
  props<{ data: { label: string, value: string }, status: string }>()
);
const useUniqueSuccessAction = createAction(
  DeviceActionType.REMOVE.SUCCESS,
  props<{ result: boolean, status: string }>()
);
const useUniqueErrorAction = createAction(
  DeviceActionType.REMOVE.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  DeviceActionType.RESET.FETCH,
  props<{ devices: DeviceVM[] }>()
);
export const DeviceAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useFindAllErrorAction,
  useCreateAction,
  useCreateSuccessAction,
  useCreateErrorAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useUpdateErrorAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useRemoveErrorAction,
  useUniqueAction,
  useUniqueSuccessAction,
  useUniqueErrorAction,
  useResetAction
};
