import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TicketState } from '@states';
import { ticketFeatureKey } from '@reducers';
import { ticketAdapter } from '@adapters';
const ticketFeatureSelector = createFeatureSelector<TicketState>(ticketFeatureKey);
const tickets = createSelector(ticketFeatureSelector, ticketAdapter.getSelectors().selectAll);
const entities = createSelector(ticketFeatureSelector, ticketAdapter.getSelectors().selectEntities);
const ids = createSelector(ticketFeatureSelector, ticketAdapter.getSelectors().selectIds);
const total = createSelector(ticketFeatureSelector, ticketAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(ticketFeatureSelector, (state) => state.firstLoad);
export const ticketSelector = {
  tickets,
  entities,
  ids,
  total,
  firstLoad
};
