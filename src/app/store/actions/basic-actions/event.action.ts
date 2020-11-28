import { createAction, props } from '@ngrx/store';
import { EventCM, EventUM, EventVM } from '@view-models';
const EventActionType = {
  FIND: {
    FETCH: '[Event] Fetch Action',
    SUCCESS: '[Event] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Event] Create Action',
    SUCCESS: '[Event] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Event] Update Action',
    SUCCESS: '[Event] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Event] Remove Action',
    SUCCESS: '[Event] Remove Action Success',
  },
  RESET: {
    FETCH: '[Event] Reset Action',
  },
  ERROR: '[Event] Action Error',
};
const useFindAllAction = createAction(
  EventActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  EventActionType.FIND.SUCCESS,
  props<{ events: EventVM[], status: string }>()
);
const useCreateAction = createAction(
  EventActionType.CREATE.FETCH,
  props<{ event: EventCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  EventActionType.CREATE.SUCCESS,
  props<{ event: EventVM, status: string }>()
);
const useUpdateAction = createAction(
  EventActionType.UPDATE.FETCH,
  props<{ event: EventUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  EventActionType.UPDATE.SUCCESS,
  props<{ event: EventVM, status: string }>()
);
const useRemoveAction = createAction(
  EventActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  EventActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  EventActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  EventActionType.RESET.FETCH,
  props<{ events: EventVM[] }>()
);
export const EventAction = {
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
