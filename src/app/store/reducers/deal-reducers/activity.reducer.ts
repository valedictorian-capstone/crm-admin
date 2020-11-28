import { ActivityAction } from '@actions';
import { activityAdapter, activityInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { ActivityState } from '@states';
export const activityFeatureKey = 'activity';
export const activityReducer = createReducer(
  activityInitialState,
  on(ActivityAction.useFindAllAction,
    (state, action) => activityAdapter.setAll<ActivityState>([], {
      ...state,
      status: action.status
    })
  ),
  on(ActivityAction.useFindAllSuccessAction,
    (state, action) => activityAdapter.setAll<ActivityState>(action.activitys, {
      ...state,
      status: action.status
    })
  ),
  on(ActivityAction.useUpdateAction,
    (state, action) => activityAdapter.setOne<ActivityState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(ActivityAction.useUpdateSuccessAction,
    (state, action) => activityAdapter.updateOne<ActivityState>({
      id: action.activity.id,
      changes: action.activity
    }, state)
  ),
  on(ActivityAction.useCreateAction,
    (state, action) => activityAdapter.setOne<ActivityState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(ActivityAction.useCreateSuccessAction,
    (state, action) => activityAdapter.addOne<ActivityState>(action.activity, state)
  ),
  on(ActivityAction.useRemoveAction,
    (state, action) => activityAdapter.setOne<ActivityState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(ActivityAction.useRemoveSuccessAction,
    (state, action) => activityAdapter.removeOne<ActivityState>(action.id, state)
  ),
  on(ActivityAction.useResetAction,
    (state, action) => activityAdapter.setAll<ActivityState>(action.activitys, activityInitialState)
  ),
  on(ActivityAction.useErrorAction,
    (state, action) => activityAdapter.setOne<ActivityState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
