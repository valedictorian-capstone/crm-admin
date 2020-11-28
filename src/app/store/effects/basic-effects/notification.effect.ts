import { createAction, props } from '@ngrx/store';
import { NotificationVM } from '@view-models';
const NotificationActionType = {
  FIND: {
    FETCH: '[Notification] Fetch Actions',
    SUCCESS: '[Notification] Fetch Actions Success',
    ERROR: '[Notification] Fetch Actions Error',
  },
  SEEM: {
    FETCH: '[Notification] Seen Actions',
    SUCCESS: '[Notification] Seen Actions Success',
    ERROR: '[Notification] Seen Actions Error',
  },
  SEEMALL: {
    FETCH: '[Notification] Seen All Actions',
    SUCCESS: '[Notification] Seen All Actions Success',
    ERROR: '[Notification] Seen All Actions Error',
  },
  RESET: {
    FETCH: '[Notification] Reset Actions',
  },
};
const useFindAllAction = createAction(
  NotificationActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  NotificationActionType.FIND.SUCCESS,
  props<{ notifications: NotificationVM[], status: string }>()
);
const useFindAllErrorAction = createAction(
  NotificationActionType.FIND.ERROR,
  props<{ error: string, status: string }>()
);
const useSeenAction = createAction(
  NotificationActionType.SEEM.FETCH,
  props<{ id: string, status: string }>()
);
const useSeenSuccessAction = createAction(
  NotificationActionType.SEEM.SUCCESS,
  props<{ status: string }>()
);
const useSeenErrorAction = createAction(
  NotificationActionType.SEEM.ERROR,
  props<{ error: string, status: string }>()
);
const useSeenAllAction = createAction(
  NotificationActionType.SEEMALL.FETCH,
  props<{ id: string, status: string }>()
);
const useSeenAllSuccessAction = createAction(
  NotificationActionType.SEEMALL.SUCCESS,
  props<{ status: string }>()
);
const useSeenAllErrorAction = createAction(
  NotificationActionType.SEEMALL.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  NotificationActionType.RESET.FETCH,
  props<{ notifications: NotificationVM[] }>()
);
export const NotificationAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useFindAllErrorAction,
  useSeenAction,
  useSeenSuccessAction,
  useSeenErrorAction,
  useSeenAllAction,
  useSeenAllSuccessAction,
  useSeenAllErrorAction,
  useResetAction
};
