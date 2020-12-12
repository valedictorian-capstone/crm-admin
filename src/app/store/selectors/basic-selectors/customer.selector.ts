import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '@states';
import { customerFeatureKey } from '@reducers';
import { customerAdapter } from '@adapters';
const customerFeatureSelector = createFeatureSelector<CustomerState>(customerFeatureKey);
const customers = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectAll);
const entities = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectEntities);
const ids = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectIds);
const total = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(customerFeatureSelector, (state) => state.firstLoad);
export const customerSelector = {
  customers,
  entities,
  ids,
  total,
  firstLoad
};
