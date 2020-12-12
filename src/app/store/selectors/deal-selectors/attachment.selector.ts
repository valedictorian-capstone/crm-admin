import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AttachmentState } from '@states';
import { attachmentFeatureKey } from '@reducers';
import { attachmentAdapter } from '@adapters';
const attachmentFeatureSelector = createFeatureSelector<AttachmentState>(attachmentFeatureKey);
const attachments = createSelector(attachmentFeatureSelector, attachmentAdapter.getSelectors().selectAll);
const entities = createSelector(attachmentFeatureSelector, attachmentAdapter.getSelectors().selectEntities);
const ids = createSelector(attachmentFeatureSelector, attachmentAdapter.getSelectors().selectIds);
const total = createSelector(attachmentFeatureSelector, attachmentAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(attachmentFeatureSelector, (state) => state.firstLoad);
export const attachmentSelector = {
  attachments,
  entities,
  ids,
  total,
  firstLoad,
};
