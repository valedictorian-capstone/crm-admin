import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActivityState } from '@states';
import { ActivityVM } from '@view-models';
export const activityAdapter: EntityAdapter<ActivityVM> = createEntityAdapter<ActivityVM>();

export const activityInitialState: ActivityState = activityAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
