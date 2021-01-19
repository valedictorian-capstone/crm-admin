import { createReducer, on } from '@ngrx/store';
import { logAdapter, logInitialState } from '@adapters';
import { LogAction } from '@actions';
import { LogState } from '@states';
export const logFeatureKey = 'log';
export const logReducer = createReducer(
  logInitialState,
  on(LogAction.FindAllSuccessAction,
    (state, action) => logAdapter.setAll<LogState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(LogAction.SaveSuccessAction,
    (state, action) => logAdapter.upsertOne<LogState>(action.res, {
      ...state,
    })
  ),
  on(LogAction.RemoveSuccessAction,
    (state, action) => logAdapter.removeOne<LogState>(action.id, {
      ...state,
    })
  ),
  on(LogAction.ListAction,
    (state, action) => logAdapter.upsertMany<LogState>(action.res, {
      ...state,
    })
  ),
  on(LogAction.ResetAction,
    () => logAdapter.setAll<LogState>([], logInitialState)
  ),
);
