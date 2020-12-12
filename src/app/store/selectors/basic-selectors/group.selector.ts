import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupState } from '@states';
import { groupFeatureKey } from '@reducers';
import { groupAdapter } from '@adapters';
const groupFeatureSelector = createFeatureSelector<GroupState>(groupFeatureKey);
const groups = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectAll);
const entities = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectEntities);
const ids = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectIds);
const total = createSelector(groupFeatureSelector, groupAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(groupFeatureSelector, (state) => state.firstLoad);
export const groupSelector = {
  groups,
  entities,
  ids,
  total,
  firstLoad,
};
