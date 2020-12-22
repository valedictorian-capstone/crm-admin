import { GroupAction } from '@actions';
import { groupAdapter, groupInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { GroupState } from '@states';
export const groupFeatureKey = 'group';
export const groupReducer = createReducer(
  groupInitialState,
  on(GroupAction.FindAllSuccessAction,
    (state, action) => groupAdapter.setAll<GroupState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(GroupAction.ListAction,
    (state, action) => groupAdapter.upsertMany<GroupState>(action.res, {
      ...state,
    })
  ),
  on(GroupAction.ResetAction,
    () => groupAdapter.setAll<GroupState>([], groupInitialState)
  ),
);
