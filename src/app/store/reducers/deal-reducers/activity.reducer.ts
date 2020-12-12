import { createReducer, on } from '@ngrx/store';
import { activityAdapter, activityInitialState } from '@adapters';
import { ActivityAction } from '@actions';
import { ActivityState } from '@states';
export const activityFeatureKey = 'activity';
export const activityReducer = createReducer(
  activityInitialState,
  on(ActivityAction.FindAllSuccessAction,
    (state, action) => activityAdapter.setAll<ActivityState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(ActivityAction.FindAllSuccessAction,
    (state, action) => activityAdapter.setAll<ActivityState>(action.res, {
      ...state,
    })
  ),
  on(ActivityAction.SaveSuccessAction,
    (state, action) => activityAdapter.upsertOne<ActivityState>(action.res, {
      ...state,
    })
  ),
  on(ActivityAction.RemoveSuccessAction,
    (state, action) => activityAdapter.removeOne<ActivityState>(action.id, {
      ...state,
    })
  ),
  on(ActivityAction.ResetAction,
    () => activityAdapter.setAll<ActivityState>([], activityInitialState)
  ),
);
