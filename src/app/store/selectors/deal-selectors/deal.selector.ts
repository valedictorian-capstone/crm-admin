import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DealState } from '@states';
import { dealFeatureKey } from '@reducers';
import { dealAdapter } from '@adapters';
const dealFeatureSelector = createFeatureSelector<DealState>(dealFeatureKey);
const deals = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectAll);
const entities = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectEntities);
const ids = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectIds);
const total = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectTotal);
const error = createSelector(dealFeatureSelector, (state) => state.error);
const status = createSelector(dealFeatureSelector, (state) => state.status);
export const dealSelector = {
  deals,
  entities,
  ids,
  total,
  error,
  status,
};
