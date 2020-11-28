import { DeviceAction } from '@actions';
import { deviceAdapter, deviceInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { DeviceState } from '@states';
export const deviceFeatureKey = 'device';
export const deviceReducer = createReducer(
  deviceInitialState,
  on(DeviceAction.useFindAllAction,
    (state, action) => deviceAdapter.setAll<DeviceState>([], {
      ...state,
      status: action.status
    })
  ),
  on(DeviceAction.useFindAllSuccessAction,
    (state, action) => deviceAdapter.setAll<DeviceState>(action.devices, {
      ...state,
      status: action.status
    })
  ),
  on(DeviceAction.useUpdateAction,
    (state, action) => deviceAdapter.setOne<DeviceState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DeviceAction.useUpdateSuccessAction,
    (state, action) => deviceAdapter.updateOne<DeviceState>({
      id: action.device.id,
      changes: action.device
    }, state)
  ),
  on(DeviceAction.useCreateAction,
    (state, action) => deviceAdapter.setOne<DeviceState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DeviceAction.useCreateSuccessAction,
    (state, action) => deviceAdapter.addOne<DeviceState>(action.device, state)
  ),
  on(DeviceAction.useRemoveAction,
    (state, action) => deviceAdapter.setOne<DeviceState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DeviceAction.useRemoveSuccessAction,
    (state, action) => deviceAdapter.removeOne<DeviceState>(action.id, state)
  ),
  on(DeviceAction.useResetAction,
    (state, action) => deviceAdapter.setAll<DeviceState>(action.devices, deviceInitialState)
  ),
  on(DeviceAction.useErrorAction,
    (state, action) => deviceAdapter.setOne<DeviceState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
