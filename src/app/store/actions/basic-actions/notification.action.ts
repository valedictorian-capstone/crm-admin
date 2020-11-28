import { createAction, props } from '@ngrx/store';
import { NotificationVM } from '@view-models';
const NotificationActionType = {
  FIND: {
    FETCH: '[Notification] Fetch Actions',
    SUCCESS: '[Notification] Fetch Actions Success',
  },
  SEEM: {
    FETCH: '[Notification] Seen Actions',
    SUCCESS: '[Notification] Seen Actions Success',
  },
  SEEMALL: {
    FETCH: '[Notification] Seen All Actions',
    SUCCESS: '[Notification] Seen All Actions Success',
  },
  RESET: {
    FETCH: '[Notification] Reset Actions',
  },
  ERROR: '[Notification] Action Error',
};
const useFindAllAction = createAction(
  NotificationActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  NotificationActionType.FIND.SUCCESS,
  props<{ notifications: NotificationVM[], status: string }>()
);
const useSeenAction = createAction(
  NotificationActionType.SEEM.FETCH,
  props<{ id: string, status: string }>()
);
const useSeenSuccessAction = createAction(
  NotificationActionType.SEEM.SUCCESS,
  props<{ notification: NotificationVM, status: string }>()
);
const useSeenAllAction = createAction(
  NotificationActionType.SEEMALL.FETCH,
  props<{ ids: string[], status: string }>()
);
const useSeenAllSuccessAction = createAction(
  NotificationActionType.SEEMALL.SUCCESS,
  props<{ notifications: NotificationVM[], status: string }>()
);
const useErrorAction = createAction(
  NotificationActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  NotificationActionType.RESET.FETCH,
  props<{ notifications: NotificationVM[] }>()
);
export const NotificationAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useSeenAction,
  useSeenSuccessAction,
  useSeenAllAction,
  useSeenAllSuccessAction,
  useErrorAction,
  useResetAction
};
