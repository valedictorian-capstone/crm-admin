import { createReducer, on } from '@ngrx/store';
import { notificationAdapter, notificationInitialState } from '@adapters';
import { NotificationAction } from '@actions';
import { NotificationState } from '@states';
export const notificationFeatureKey = 'notification';
export const notificationReducer = createReducer(
  notificationInitialState,
  on(NotificationAction.FindAllSuccessAction,
    (state, action) => notificationAdapter.setAll<NotificationState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(NotificationAction.SaveSuccessAction,
    (state, action) => notificationAdapter.upsertOne<NotificationState>(action.res, {
      ...state,
    })
  ),
  on(NotificationAction.SeenAllSuccessAction,
    (state, action) => notificationAdapter.updateMany<NotificationState>(action.res.map((notification) => ({ id: notification.id, changes: notification })), {
      ...state,
    })
  ),
  on(NotificationAction.ListAction,
    (state, action) => notificationAdapter.upsertMany<NotificationState>(action.res, {
      ...state,
    })
  ),
  on(NotificationAction.ResetAction,
    () => notificationAdapter.setAll<NotificationState>([], notificationInitialState)
  ),
);
