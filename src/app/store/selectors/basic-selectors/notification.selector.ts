import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from '@states';
import { notificationFeatureKey } from '@reducers';
import { notificationAdapter } from '@adapters';
const notificationFeatureSelector = createFeatureSelector<NotificationState>(notificationFeatureKey);
const notifications = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectAll);
const entities = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectEntities);
const ids = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectIds);
const total = createSelector(notificationFeatureSelector, notificationAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(notificationFeatureSelector, (state) => state.firstLoad);
export const notificationSelector = {
  notifications,
  entities,
  ids,
  total,
  firstLoad,
};
