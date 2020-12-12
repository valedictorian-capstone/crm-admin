import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StageState } from '@states';
import { stageFeatureKey } from '@reducers';
import { stageAdapter } from '@adapters';
const stageFeatureSelector = createFeatureSelector<StageState>(stageFeatureKey);
const stages = createSelector(stageFeatureSelector, stageAdapter.getSelectors().selectAll);
const entities = createSelector(stageFeatureSelector, stageAdapter.getSelectors().selectEntities);
const ids = createSelector(stageFeatureSelector, stageAdapter.getSelectors().selectIds);
const total = createSelector(stageFeatureSelector, stageAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(stageFeatureSelector, (state) => state.firstLoad);
export const stageSelector = {
  stages,
  entities,
  ids,
  total,
  firstLoad,
};
