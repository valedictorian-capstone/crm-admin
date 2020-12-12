import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '@states';
import { authFeatureKey } from '@reducers';
import { authAdapter } from '@adapters';
const authFeatureSelector = createFeatureSelector<AuthState>(authFeatureKey);
const profile = createSelector(authFeatureSelector,
  (state: AuthState) => state.profile);
export const authSelector = {
  profile
};
