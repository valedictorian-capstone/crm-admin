import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from '@states';
import { customerFeatureKey } from '@reducers';
import { customerAdapter } from '@adapters';
const customerFeatureSelector = createFeatureSelector<CustomerState>(customerFeatureKey);
const customers = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectAll);
const entities = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectEntities);
const ids = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectIds);
const total = createSelector(customerFeatureSelector, customerAdapter.getSelectors().selectTotal);
const error = createSelector(customerFeatureSelector, (state) => state.error);
const status = createSelector(customerFeatureSelector, (state) => state.status);
const unique = createSelector(customerFeatureSelector, (state) => state.unique);
export const customerSelector = {
  customers,
  entities,
  ids,
  total,
  error,
  status,
  unique
};
