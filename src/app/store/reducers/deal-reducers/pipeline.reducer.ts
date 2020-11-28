import { PipelineAction } from '@actions';
import { pipelineAdapter, pipelineInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { PipelineState } from '@states';
export const pipelineFeatureKey = 'pipeline';
export const pipelineReducer = createReducer(
  pipelineInitialState,
  on(PipelineAction.useFindAllAction,
    (state, action) => pipelineAdapter.setAll<PipelineState>([], {
      ...state,
      status: action.status
    })
  ),
  on(PipelineAction.useFindAllSuccessAction,
    (state, action) => pipelineAdapter.setAll<PipelineState>(action.pipelines, {
      ...state,
      status: action.status
    })
  ),
  on(PipelineAction.useSaveAction,
    (state, action) => pipelineAdapter.setOne<PipelineState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(PipelineAction.useSaveSuccessAction,
    (state, action) => pipelineAdapter.addOne<PipelineState>(action.pipeline, state)
  ),
  on(PipelineAction.useRemoveAction,
    (state, action) => pipelineAdapter.setOne<PipelineState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(PipelineAction.useRemoveSuccessAction,
    (state, action) => pipelineAdapter.removeOne<PipelineState>(action.id, state)
  ),
  on(PipelineAction.useResetAction,
    (state, action) => pipelineAdapter.setAll<PipelineState>(action.pipelines, pipelineInitialState)
  ),
  on(PipelineAction.useErrorAction,
    (state, action) => pipelineAdapter.setOne<PipelineState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
