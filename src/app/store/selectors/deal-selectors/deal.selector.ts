import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DealState } from '@states';
import { dealFeatureKey } from '@reducers';
import { dealAdapter } from '@adapters';
const dealFeatureSelector = createFeatureSelector<DealState>(dealFeatureKey);
const deals = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectAll);
const entities = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectEntities);
const ids = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectIds);
const total = createSelector(dealFeatureSelector, dealAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(dealFeatureSelector, (state) => state.firstLoad);
export const dealSelector = {
  deals,
  entities,
  ids,
  total,
  firstLoad,
};
