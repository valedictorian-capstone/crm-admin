import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TicketState } from '@states';
import { TicketVM } from '@view-models';
export const ticketAdapter: EntityAdapter<TicketVM> = createEntityAdapter<TicketVM>();

export const ticketInitialState: TicketState = ticketAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
