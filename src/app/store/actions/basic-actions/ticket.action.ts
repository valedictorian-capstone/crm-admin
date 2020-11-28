import { createAction, props } from '@ngrx/store';
import { TicketCM, TicketUM, TicketVM } from '@view-models';
const TicketActionType = {
  FIND: {
    FETCH: '[Ticket] Fetch Action',
    SUCCESS: '[Ticket] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Ticket] Create Action',
    SUCCESS: '[Ticket] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Ticket] Update Action',
    SUCCESS: '[Ticket] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Ticket] Remove Action',
    SUCCESS: '[Ticket] Remove Action Success',
  },
  RESET: {
    FETCH: '[Ticket] Reset Action',
  },
  ERROR: '[Ticket] Action Error',
};
const useFindAllAction = createAction(
  TicketActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  TicketActionType.FIND.SUCCESS,
  props<{ tickets: TicketVM[], status: string }>()
);
const useCreateAction = createAction(
  TicketActionType.CREATE.FETCH,
  props<{ ticket: TicketCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  TicketActionType.CREATE.SUCCESS,
  props<{ ticket: TicketVM, status: string }>()
);
const useUpdateAction = createAction(
  TicketActionType.UPDATE.FETCH,
  props<{ ticket: TicketUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  TicketActionType.UPDATE.SUCCESS,
  props<{ ticket: TicketVM, status: string }>()
);
const useRemoveAction = createAction(
  TicketActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  TicketActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  TicketActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  TicketActionType.RESET.FETCH,
  props<{ tickets: TicketVM[] }>()
);
export const TicketAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useCreateAction,
  useCreateSuccessAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useErrorAction,
  useResetAction
};
