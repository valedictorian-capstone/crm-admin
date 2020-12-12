import { createReducer, on } from '@ngrx/store';
import { roleAdapter, roleInitialState } from '@adapters';
import { RoleAction } from '@actions';
import { RoleState } from '@states';
export const roleFeatureKey = 'role';
export const roleReducer = createReducer(
  roleInitialState,
  on(RoleAction.FindAllSuccessAction,
    (state, action) => roleAdapter.setAll<RoleState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(RoleAction.FindAllSuccessAction,
    (state, action) => roleAdapter.setAll<RoleState>(action.res, {
      ...state,
    })
  ),
  on(RoleAction.SaveSuccessAction,
    (state, action) => roleAdapter.upsertOne<RoleState>(action.res, {
      ...state,
    })
  ),
  on(RoleAction.RemoveSuccessAction,
    (state, action) => roleAdapter.removeOne<RoleState>(action.id, {
      ...state,
    })
  ),
  on(RoleAction.ResetAction,
    () => roleAdapter.setAll<RoleState>([], roleInitialState)
  ),
);
