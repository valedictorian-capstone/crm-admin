import { NotificationAction } from '@actions';
import { notificationAdapter, notificationInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { NotificationState } from '@states';
export const notificationFeatureKey = 'notification';
export const notificationReducer = createReducer(
  notificationInitialState,
  on(NotificationAction.useFindAllAction,
    (state, action) => notificationAdapter.setAll<NotificationState>([], {
      ...state,
      status: action.status
    })
  ),
  on(NotificationAction.useFindAllSuccessAction,
    (state, action) => notificationAdapter.setAll<NotificationState>(action.notifications, {
      ...state,
      status: action.status
    })
  ),
  on(NotificationAction.useSeenAction,
    (state, action) => notificationAdapter.setOne<NotificationState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(NotificationAction.useSeenSuccessAction,
    (state, action) => notificationAdapter.updateOne<NotificationState>({
      id: action.notification.id,
      changes: action.notification
    }, state)
  ),
  on(NotificationAction.useSeenAllAction,
    (state, action) => notificationAdapter.setOne<NotificationState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(NotificationAction.useSeenAllSuccessAction,
    (state, action) => notificationAdapter.updateMany<NotificationState>(action.notifications.map((e) => ({
      id: e.id,
      changes: e
    })), state)
  ),
  on(NotificationAction.useResetAction,
    (state, action) => notificationAdapter.setAll<NotificationState>(action.notifications, notificationInitialState)
  ),
  on(NotificationAction.useErrorAction,
    (state, action) => notificationAdapter.setOne<NotificationState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
