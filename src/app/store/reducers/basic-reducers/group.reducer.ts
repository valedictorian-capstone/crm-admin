import { GroupAction } from '@actions';
import { groupAdapter, groupInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { GroupState } from '@states';
export const groupFeatureKey = 'group';
export const groupReducer = createReducer(
  groupInitialState,
  on(GroupAction.useFindAllAction,
    (state, action) => groupAdapter.setAll<GroupState>([], {
      ...state,
      status: action.status
    })
  ),
  on(GroupAction.useFindAllSuccessAction,
    (state, action) => groupAdapter.setAll<GroupState>(action.groups, {
      ...state,
      status: action.status
    })
  ),
  on(GroupAction.useUpdateAction,
    (state, action) => groupAdapter.setOne<GroupState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(GroupAction.useUpdateSuccessAction,
    (state, action) => groupAdapter.updateOne<GroupState>({
      id: action.group.id,
      changes: action.group
    }, state)
  ),
  on(GroupAction.useCreateAction,
    (state, action) => groupAdapter.setOne<GroupState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(GroupAction.useCreateSuccessAction,
    (state, action) => groupAdapter.addOne<GroupState>(action.group, state)
  ),
  on(GroupAction.useRemoveAction,
    (state, action) => groupAdapter.setOne<GroupState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(GroupAction.useRemoveSuccessAction,
    (state, action) => groupAdapter.removeOne<GroupState>(action.id, state)
  ),
  on(GroupAction.useResetAction,
    (state, action) => groupAdapter.setAll<GroupState>(action.groups, groupInitialState)
  ),
  on(GroupAction.useErrorAction,
    (state, action) => groupAdapter.setOne<GroupState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
