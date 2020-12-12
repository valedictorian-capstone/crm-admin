import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentState } from '@states';
import { commentFeatureKey } from '@reducers';
import { commentAdapter } from '@adapters';
const commentFeatureSelector = createFeatureSelector<CommentState>(commentFeatureKey);
const comments = createSelector(commentFeatureSelector, commentAdapter.getSelectors().selectAll);
const entities = createSelector(commentFeatureSelector, commentAdapter.getSelectors().selectEntities);
const ids = createSelector(commentFeatureSelector, commentAdapter.getSelectors().selectIds);
const total = createSelector(commentFeatureSelector, commentAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(commentFeatureSelector, (state) => state.firstLoad);
export const commentSelector = {
  comments,
  entities,
  ids,
  total,
  firstLoad,
};
