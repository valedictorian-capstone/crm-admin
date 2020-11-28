import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventState } from '@states';
import { eventFeatureKey } from '@reducers';
import { eventAdapter } from '@adapters';
const eventFeatureSelector = createFeatureSelector<EventState>(eventFeatureKey);
const events = createSelector(eventFeatureSelector, eventAdapter.getSelectors().selectAll);
const entities = createSelector(eventFeatureSelector, eventAdapter.getSelectors().selectEntities);
const ids = createSelector(eventFeatureSelector, eventAdapter.getSelectors().selectIds);
const total = createSelector(eventFeatureSelector, eventAdapter.getSelectors().selectTotal);
const error = createSelector(eventFeatureSelector, (state) => state.error);
const status = createSelector(eventFeatureSelector, (state) => state.status);
export const eventSelector = {
  events,
  entities,
  ids,
  total,
  error,
  status,
};
