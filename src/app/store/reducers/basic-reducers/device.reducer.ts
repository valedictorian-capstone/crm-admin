import { createReducer, on } from '@ngrx/store';
import { deviceAdapter, deviceInitialState } from '@adapters';
import { DeviceAction } from '@actions';
import { DeviceState } from '@states';
export const deviceFeatureKey = 'device';
export const deviceReducer = createReducer(
  deviceInitialState,
  on(DeviceAction.FindAllSuccessAction,
    (state, action) => deviceAdapter.setAll<DeviceState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(DeviceAction.FindAllSuccessAction,
    (state, action) => deviceAdapter.setAll<DeviceState>(action.res, {
      ...state,
    })
  ),
  on(DeviceAction.SaveSuccessAction,
    (state, action) => deviceAdapter.upsertOne<DeviceState>(action.res, {
      ...state,
    })
  ),
  on(DeviceAction.RemoveSuccessAction,
    (state, action) => deviceAdapter.removeOne<DeviceState>(action.id, {
      ...state,
    })
  ),
  on(DeviceAction.ResetAction,
    () => deviceAdapter.setAll<DeviceState>([], deviceInitialState)
  ),
);
