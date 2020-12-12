import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PipelineState } from '@states';
import { pipelineFeatureKey } from '@reducers';
import { pipelineAdapter } from '@adapters';
const pipelineFeatureSelector = createFeatureSelector<PipelineState>(pipelineFeatureKey);
const pipelines = createSelector(pipelineFeatureSelector, pipelineAdapter.getSelectors().selectAll);
const entities = createSelector(pipelineFeatureSelector, pipelineAdapter.getSelectors().selectEntities);
const ids = createSelector(pipelineFeatureSelector, pipelineAdapter.getSelectors().selectIds);
const total = createSelector(pipelineFeatureSelector, pipelineAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(pipelineFeatureSelector, (state) => state.firstLoad);
export const pipelineSelector = {
  pipelines,
  entities,
  ids,
  total,
  firstLoad,
};
