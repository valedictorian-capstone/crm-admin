import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceState } from '@states';
import { deviceFeatureKey } from '@reducers';
import { deviceAdapter } from '@adapters';
const deviceFeatureSelector = createFeatureSelector<DeviceState>(deviceFeatureKey);
const devices = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectAll);
const entities = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectEntities);
const ids = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectIds);
const total = createSelector(deviceFeatureSelector, deviceAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(deviceFeatureSelector, (state) => state.firstLoad);
export const deviceSelector = {
  devices,
  entities,
  ids,
  total,
  firstLoad
};
