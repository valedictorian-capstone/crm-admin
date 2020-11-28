import { createAction, props } from '@ngrx/store';
import { EventCM, EventUM, EventVM } from '@view-models';
const EventActionType = {
  FIND: {
    FETCH: '[Event] Fetch Actions',
    SUCCESS: '[Event] Fetch Actions Success',
    ERROR: '[Event] Fetch Actions Error',
  },
  CREATE: {
    FETCH: '[Event] Create Actions',
    SUCCESS: '[Event] Create Actions Success',
    ERROR: '[Event] Create Actions Error',
  },
  UPDATE: {
    FETCH: '[Event] Update Actions',
    SUCCESS: '[Event] Update Actions Success',
    ERROR: '[Event] Update Actions Error',
  },
  REMOVE: {
    FETCH: '[Event] Remove Actions',
    SUCCESS: '[Event] Remove Actions Success',
    ERROR: '[Event] Remove Actions Error',
  },
  UNIQUE: {
    FETCH: '[Event] Unique Actions',
    SUCCESS: '[Event] Unique Actions Success',
    ERROR: '[Event] Unique Actions Error',
  },
  RESET: {
    FETCH: '[Event] Reset Actions',
  },
};
const useFindAllAction = createAction(
  EventActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  EventActionType.FIND.SUCCESS,
  props<{ events: EventVM[], status: string }>()
);
const useFindAllErrorAction = createAction(
  EventActionType.FIND.ERROR,
  props<{ error: string, status: string }>()
);
const useCreateAction = createAction(
  EventActionType.CREATE.FETCH,
  props<{ event: EventCM, status: string }>()
);
const useCreateSuccessAction = createAction(
  EventActionType.CREATE.SUCCESS,
  props<{ event: EventVM, status: string }>()
);
const useCreateErrorAction = createAction(
  EventActionType.CREATE.ERROR,
  props<{ error: string, status: string }>()
);
const useUpdateAction = createAction(
  EventActionType.UPDATE.FETCH,
  props<{ event: EventUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  EventActionType.UPDATE.SUCCESS,
  props<{ event: EventVM, status: string }>()
);
const useUpdateErrorAction = createAction(
  EventActionType.UPDATE.ERROR,
  props<{ error: string, status: string }>()
);
const useRemoveAction = createAction(
  EventActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  EventActionType.REMOVE.SUCCESS,
  props<{ message: string, status: string }>()
);
const useRemoveErrorAction = createAction(
  EventActionType.REMOVE.ERROR,
  props<{ error: string, status: string }>()
);
const useUniqueAction = createAction(
  EventActionType.REMOVE.FETCH,
  props<{ data: { label: string, value: string }, status: string }>()
);
const useUniqueSuccessAction = createAction(
  EventActionType.REMOVE.SUCCESS,
  props<{ result: boolean, status: string }>()
);
const useUniqueErrorAction = createAction(
  EventActionType.REMOVE.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  EventActionType.RESET.FETCH,
  props<{ events: EventVM[] }>()
);
export const EventAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useFindAllErrorAction,
  useCreateAction,
  useCreateSuccessAction,
  useCreateErrorAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useUpdateErrorAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useRemoveErrorAction,
  useUniqueAction,
  useUniqueSuccessAction,
  useUniqueErrorAction,
  useResetAction
};
