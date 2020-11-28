import { StageAction } from '@actions';
import { stageAdapter, stageInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { StageState } from '@states';
export const stageFeatureKey = 'stage';
export const stageReducer = createReducer(
  stageInitialState,
  on(StageAction.useFindAllAction,
    (state, action) => stageAdapter.setAll<StageState>([], {
      ...state,
      status: action.status
    })
  ),
  on(StageAction.useFindAllSuccessAction,
    (state, action) => stageAdapter.setAll<StageState>(action.stages, {
      ...state,
      status: action.status
    })
  ),
  on(StageAction.useUpdateAction,
    (state, action) => stageAdapter.setOne<StageState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(StageAction.useUpdateSuccessAction,
    (state, action) => stageAdapter.updateOne<StageState>({
      id: action.stage.id,
      changes: action.stage
    }, state)
  ),
  on(StageAction.useCreateAction,
    (state, action) => stageAdapter.setOne<StageState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(StageAction.useCreateSuccessAction,
    (state, action) => stageAdapter.addOne<StageState>(action.stage, state)
  ),
  on(StageAction.useRemoveAction,
    (state, action) => stageAdapter.setOne<StageState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(StageAction.useRemoveSuccessAction,
    (state, action) => stageAdapter.removeOne<StageState>(action.id, state)
  ),
  on(StageAction.useResetAction,
    (state, action) => stageAdapter.setAll<StageState>(action.stages, stageInitialState)
  ),
  on(StageAction.useErrorAction,
    (state, action) => stageAdapter.setOne<StageState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
