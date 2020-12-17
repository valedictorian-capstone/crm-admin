import { createReducer, on } from '@ngrx/store';
import { stageAdapter, stageInitialState } from '@adapters';
import { StageAction } from '@actions';
import { StageState } from '@states';
export const stageFeatureKey = 'stage';
export const stageReducer = createReducer(
  stageInitialState,
  on(StageAction.FindAllSuccessAction,
    (state, action) => stageAdapter.setAll<StageState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(StageAction.SaveSuccessAction,
    (state, action) => stageAdapter.upsertOne<StageState>(action.res, {
      ...state,
    })
  ),
  on(StageAction.RemoveSuccessAction,
    (state, action) => stageAdapter.removeOne<StageState>(action.id, {
      ...state,
    })
  ),
  on(StageAction.ResetAction,
    () => stageAdapter.setAll<StageState>([], stageInitialState)
  ),
);
