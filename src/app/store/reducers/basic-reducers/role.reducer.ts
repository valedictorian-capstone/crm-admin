import { RoleAction } from '@actions';
import { roleAdapter, roleInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { RoleState } from '@states';
export const roleFeatureKey = 'role';
export const roleReducer = createReducer(
  roleInitialState,
  on(RoleAction.useFindAllAction,
    (state, action) => roleAdapter.setAll<RoleState>([], {
      ...state,
      status: action.status
    })
  ),
  on(RoleAction.useFindAllSuccessAction,
    (state, action) => roleAdapter.setAll<RoleState>(action.roles, {
      ...state,
      status: action.status
    })
  ),
  on(RoleAction.useUpdateAction,
    (state, action) => roleAdapter.setOne<RoleState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(RoleAction.useUpdateSuccessAction,
    (state, action) => roleAdapter.updateOne<RoleState>({
      id: action.role.id,
      changes: action.role
    }, state)
  ),
  on(RoleAction.useCreateAction,
    (state, action) => roleAdapter.setOne<RoleState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(RoleAction.useCreateSuccessAction,
    (state, action) => roleAdapter.addOne<RoleState>(action.role, state)
  ),
  on(RoleAction.useRemoveAction,
    (state, action) => roleAdapter.setOne<RoleState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(RoleAction.useRemoveSuccessAction,
    (state, action) => roleAdapter.removeOne<RoleState>(action.id, state)
  ),
  on(RoleAction.useResetAction,
    (state, action) => roleAdapter.setAll<RoleState>(action.roles, roleInitialState)
  ),
  on(RoleAction.useErrorAction,
    (state, action) => roleAdapter.setOne<RoleState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
