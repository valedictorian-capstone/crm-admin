import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActivityState } from '@states';
import { activityFeatureKey } from '@reducers';
import { activityAdapter } from '@adapters';
const activityFeatureSelector = createFeatureSelector<ActivityState>(activityFeatureKey);
const activitys = createSelector(activityFeatureSelector, activityAdapter.getSelectors().selectAll);
const entities = createSelector(activityFeatureSelector, activityAdapter.getSelectors().selectEntities);
const ids = createSelector(activityFeatureSelector, activityAdapter.getSelectors().selectIds);
const total = createSelector(activityFeatureSelector, activityAdapter.getSelectors().selectTotal);
const error = createSelector(activityFeatureSelector, (state) => state.error);
const status = createSelector(activityFeatureSelector, (state) => state.status);
export const activitySelector = {
  activitys,
  entities,
  ids,
  total,
  error,
  status,
};
