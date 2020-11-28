import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupState } from '@states';
import { groupFeatureKey } from '@reducers';
import { groupAdapter } from '@adapters';
const groupFeatureSelector = createFeatureSelector<GroupState>(groupFeatureKey);
const groups = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectAll);
const entities = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectEntities);
const ids = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectIds);
const total = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectTotal);
const error = createSelector(groupFeatureSelector, (state) => state.error);
const status = createSelector(groupFeatureSelector, (state) => state.status);
export const groupSelector = {
  groups,
  entities,
  ids,
  total,
  error,
  status,
};
