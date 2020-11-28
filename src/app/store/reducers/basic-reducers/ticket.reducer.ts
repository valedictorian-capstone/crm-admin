import { TicketAction } from '@actions';
import { ticketAdapter, ticketInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { TicketState } from '@states';
export const ticketFeatureKey = 'ticket';
export const ticketReducer = createReducer(
  ticketInitialState,
  on(TicketAction.useFindAllAction,
    (state, action) => ticketAdapter.setAll<TicketState>([], {
      ...state,
      status: action.status
    })
  ),
  on(TicketAction.useFindAllSuccessAction,
    (state, action) => ticketAdapter.setAll<TicketState>(action.tickets, {
      ...state,
      status: action.status
    })
  ),
  on(TicketAction.useUpdateAction,
    (state, action) => ticketAdapter.setOne<TicketState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(TicketAction.useUpdateSuccessAction,
    (state, action) => ticketAdapter.updateOne<TicketState>({
      id: action.ticket.id,
      changes: action.ticket
    }, state)
  ),
  on(TicketAction.useCreateAction,
    (state, action) => ticketAdapter.setOne<TicketState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(TicketAction.useCreateSuccessAction,
    (state, action) => ticketAdapter.addOne<TicketState>(action.ticket, state)
  ),
  on(TicketAction.useRemoveAction,
    (state, action) => ticketAdapter.setOne<TicketState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(TicketAction.useRemoveSuccessAction,
    (state, action) => ticketAdapter.removeOne<TicketState>(action.id, state)
  ),
  on(TicketAction.useResetAction,
    (state, action) => ticketAdapter.setAll<TicketState>(action.tickets, ticketInitialState)
  ),
  on(TicketAction.useErrorAction,
    (state, action) => ticketAdapter.setOne<TicketState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
