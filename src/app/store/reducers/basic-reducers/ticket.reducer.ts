import { createReducer, on } from '@ngrx/store';
import { ticketAdapter, ticketInitialState } from '@adapters';
import { TicketAction } from '@actions';
import { TicketState } from '@states';
export const ticketFeatureKey = 'ticket';
export const ticketReducer = createReducer(
  ticketInitialState,
    on(TicketAction.FindAllAction,
    (state, action) => ticketAdapter.setAll<TicketState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(TicketAction.FindAllSuccessAction,
    (state, action) => ticketAdapter.setAll<TicketState>(action.res, {
      ...state,
    })
  ),
  on(TicketAction.SaveSuccessAction,
    (state, action) => ticketAdapter.upsertOne<TicketState>(action.res, {
      ...state,
    })
  ),
  on(TicketAction.RemoveSuccessAction,
    (state, action) => ticketAdapter.removeOne<TicketState>(action.id, {
      ...state,
    })
  ),
  on(TicketAction.ResetAction,
    () => ticketAdapter.setAll<TicketState>([], ticketInitialState)
  ),
);
