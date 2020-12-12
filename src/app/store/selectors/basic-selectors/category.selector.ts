import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from '@states';
import { categoryFeatureKey } from '@reducers';
import { categoryAdapter } from '@adapters';
const categoryFeatureSelector = createFeatureSelector<CategoryState>(categoryFeatureKey);
const categorys = createSelector(categoryFeatureSelector, categoryAdapter.getSelectors().selectAll);
const entities = createSelector(categoryFeatureSelector, categoryAdapter.getSelectors().selectEntities);
const ids = createSelector(categoryFeatureSelector, categoryAdapter.getSelectors().selectIds);
const total = createSelector(categoryFeatureSelector, categoryAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(categoryFeatureSelector, (state) => state.firstLoad);
export const categorySelector = {
  categorys,
  entities,
  ids,
  total,
  firstLoad,
};
