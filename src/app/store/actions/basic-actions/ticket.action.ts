import { createAction, props } from '@ngrx/store';
import { AccountVM, TicketCM, TicketUM, TicketVM } from '@view-models';
const FindAllAction = createAction(
  '[Ticket] Fetch Action',
  props<{
    success?: (res: TicketVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Ticket] Fetch Action Success',
  props<{ res: TicketVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Ticket] Save Success Action',
  props<{ res: TicketVM }>()
);
const RemoveSuccessAction = createAction(
  '[Ticket] Remove Success Action',
  props<{ id: string }>()
);
const ListAction = createAction(
  '[Ticket] List Action',
  props<{ res: TicketVM[] }>()
);
const SocketAction = createAction(
  '[Ticket] Socket Action',
  props<{ requester: AccountVM }>()
);
const ResetAction = createAction(
  '[Ticket] Reset Action',
);
export const TicketAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ListAction,
  ResetAction
};
