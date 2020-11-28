import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from '@states';
import { notificationFeatureKey } from '@reducers';
import { notificationAdapter } from '@adapters';
const notificationFeatureSelector = createFeatureSelector<NotificationState>(notificationFeatureKey);
const notifications = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectAll);
const entities = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectEntities);
const ids = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectIds);
const total = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectTotal);
const error = createSelector(notificationFeatureSelector, (state) => state.error);
const status = createSelector(notificationFeatureSelector, (state) => state.status);
export const notificationSelector = {
  notifications,
  entities,
  ids,
  total,
  error,
  status,
};
