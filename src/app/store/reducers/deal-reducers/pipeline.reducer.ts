import { createReducer, on } from '@ngrx/store';
import { pipelineAdapter, pipelineInitialState } from '@adapters';
import { PipelineAction } from '@actions';
import { PipelineState } from '@states';
export const pipelineFeatureKey = 'pipeline';
export const pipelineReducer = createReducer(
  pipelineInitialState,
  on(PipelineAction.FindAllSuccessAction,
    (state, action) => pipelineAdapter.setAll<PipelineState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(PipelineAction.FindAllSuccessAction,
    (state, action) => pipelineAdapter.setAll<PipelineState>(action.res, {
      ...state,
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
  on(PipelineAction.ResetAction,
    () => pipelineAdapter.setAll<PipelineState>([], pipelineInitialState)
  ),
);
