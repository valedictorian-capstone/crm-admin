import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterState } from '@states';
import { routerFeatureKey } from '@reducers';
export const routerSelector = createSelector(
  createFeatureSelector<RouterState>(routerFeatureKey),
  (state) => state
);
