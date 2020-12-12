import { createReducer, on } from '@ngrx/store';
import { authAdapter, authInitialState } from '@adapters';
import { AuthAction } from '@actions';
import { AuthState } from '@states';
export const authFeatureKey = 'auth';
export const authReducer = createReducer(
  authInitialState,
  on(AuthAction.FetchSuccessAction,
    (state, action) => authAdapter.setAll<AuthState>([], {
      ...state,
      profile: action
    })
  ),
  on(AuthAction.UpdateProfileSuccessAction,
    (state, action) => authAdapter.setAll<AuthState>([], {
      ...state,
      profile: {
        ...state.profile,
        ...action
      }
    })
  ),
  on(AuthAction.ResetAction,
    () => authAdapter.setAll<AuthState>([], authInitialState)
  ),
);
