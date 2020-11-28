import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '@states';
import { productFeatureKey } from '@reducers';
import { productAdapter } from '@adapters';
const productFeatureSelector = createFeatureSelector<ProductState>(productFeatureKey);
const products = createSelector(productFeatureSelector, productAdapter.getSelectors().selectAll);
const entities = createSelector(productFeatureSelector, productAdapter.getSelectors().selectEntities);
const ids = createSelector(productFeatureSelector, productAdapter.getSelectors().selectIds);
const total = createSelector(productFeatureSelector, productAdapter.getSelectors().selectTotal);
const error = createSelector(productFeatureSelector, (state) => state.error);
const status = createSelector(productFeatureSelector, (state) => state.status);
const unique = createSelector(productFeatureSelector, (state) => state.unique);
export const productSelector = {
  products,
  entities,
  ids,
  total,
  error,
  status,
  unique
};
