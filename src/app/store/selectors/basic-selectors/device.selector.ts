import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceState } from '@states';
import { deviceFeatureKey } from '@reducers';
import { deviceAdapter } from '@adapters';
const deviceFeatureSelector = createFeatureSelector<DeviceState>(deviceFeatureKey);
const devices = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectAll);
const entities = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectEntities);
const ids = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectIds);
const total = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectTotal);
const error = createSelector(deviceFeatureSelector, (state) => state.error);
const status = createSelector(deviceFeatureSelector, (state) => state.status);
export const deviceSelector = {
  devices,
  entities,
  ids,
  total,
  error,
  status,
};
