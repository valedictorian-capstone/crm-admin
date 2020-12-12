import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { NotificationState } from '@states';
import { NotificationVM } from '@view-models';
export const notificationAdapter: EntityAdapter<NotificationVM> = createEntityAdapter<NotificationVM>();

export const notificationInitialState: NotificationState = notificationAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
