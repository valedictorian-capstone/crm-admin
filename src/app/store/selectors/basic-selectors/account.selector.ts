import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from '@states';
import { accountFeatureKey } from '@reducers';
import { accountAdapter } from '@adapters';
const accountFeatureSelector = createFeatureSelector<AccountState>(accountFeatureKey);
const accounts = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectAll);
const entities = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectEntities);
const ids = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectIds);
const total = createSelector(accountFeatureSelector, accountAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(accountFeatureSelector, (state) => state.firstLoad);
export const accountSelector = {
  accounts,
  entities,
  ids,
  firstLoad,
};
