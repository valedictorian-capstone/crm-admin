import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActivityState } from '@states';
import { ActivityVM } from '@view-models';
export const activityAdapter: EntityAdapter<ActivityVM> = createEntityAdapter<ActivityVM>();

export const activityInitialState: ActivityState = activityAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
