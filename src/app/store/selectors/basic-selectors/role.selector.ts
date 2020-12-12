import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoleState } from '@states';
import { roleFeatureKey } from '@reducers';
import { roleAdapter } from '@adapters';
const roleFeatureSelector = createFeatureSelector<RoleState>(roleFeatureKey);
const roles = createSelector(roleFeatureSelector, roleAdapter.getSelectors().selectAll);
const entities = createSelector(roleFeatureSelector, roleAdapter.getSelectors().selectEntities);
const ids = createSelector(roleFeatureSelector, roleAdapter.getSelectors().selectIds);
const total = createSelector(roleFeatureSelector, roleAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(roleFeatureSelector, (state) => state.firstLoad);
export const roleSelector = {
  roles,
  entities,
  ids,
  total,
  firstLoad,
};
