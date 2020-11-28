import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from '@states';
import { accountFeatureKey } from '@reducers';
import { accountAdapter } from '@adapters';
const accountFeatureSelector = createFeatureSelector<AccountState>(accountFeatureKey);
const accounts = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectAll);
const entities = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectEntities);
const ids = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectIds);
const total = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectTotal);
const error = createSelector(accountFeatureSelector, (state) => state.error);
const status = createSelector(accountFeatureSelector, (state) => state.status);
const unique = createSelector(accountFeatureSelector, (state) => state.unique);
export const accountSelector = {
  accounts,
  entities,
  ids,
  total,
  error,
  status,
  unique
};
