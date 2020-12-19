import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LogState } from '@states';
import { logFeatureKey } from '@reducers';
import { logAdapter } from '@adapters';
const logFeatureSelector = createFeatureSelector<LogState>(logFeatureKey);
const logs = createSelector(logFeatureSelector, logAdapter.getSelectors().selectAll);
const entities = createSelector(logFeatureSelector, logAdapter.getSelectors().selectEntities);
const ids = createSelector(logFeatureSelector, logAdapter.getSelectors().selectIds);
const total = createSelector(logFeatureSelector, logAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(logFeatureSelector, (state) => state.firstLoad);
export const logSelector = {
  logs,
  entities,
  ids,
  total,
  firstLoad,
};
