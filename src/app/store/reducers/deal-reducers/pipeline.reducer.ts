import { createReducer, on } from '@ngrx/store';
import { pipelineAdapter, pipelineInitialState } from '@adapters';
import { PipelineAction } from '@actions';
import { PipelineState } from '@states';
export const pipelineFeatureKey = 'pipeline';
export const pipelineReducer = createReducer(
  pipelineInitialState,
  on(PipelineAction.FindAllSuccessAction,
    (state, action) => pipelineAdapter.setAll<PipelineState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(PipelineAction.SaveSuccessAction,
    (state, action) => pipelineAdapter.upsertOne<PipelineState>(action.res, {
      ...state,
    })
  ),
  on(PipelineAction.RemoveSuccessAction,
    (state, action) => pipelineAdapter.removeOne<PipelineState>(action.id, {
      ...state,
    })
  ),
  on(PipelineAction.ListAction,
    (state, action) => pipelineAdapter.upsertMany<PipelineState>(action.res, {
      ...state,
    })
  ),
  on(PipelineAction.ResetAction,
    () => pipelineAdapter.setAll<PipelineState>([], pipelineInitialState)
  ),
);
