import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DealDetailState } from '@states';
import { dealDetailFeatureKey } from '@reducers';
import { dealDetailAdapter } from '@adapters';
const dealDetailFeatureSelector = createFeatureSelector<DealDetailState>(dealDetailFeatureKey);
const dealDetails = createSelector(dealDetailFeatureSelector, dealDetailAdapter.getSelectors().selectAll);
const entities = createSelector(dealDetailFeatureSelector, dealDetailAdapter.getSelectors().selectEntities);
const ids = createSelector(dealDetailFeatureSelector, dealDetailAdapter.getSelectors().selectIds);
const total = createSelector(dealDetailFeatureSelector, dealDetailAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(dealDetailFeatureSelector, (state) => state.firstLoad);
export const dealDetailSelector = {
  dealDetails,
  entities,
  ids,
  total,
  firstLoad,
};
