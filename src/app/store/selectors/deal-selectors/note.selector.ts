import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NoteState } from '@states';
import { noteFeatureKey } from '@reducers';
import { noteAdapter } from '@adapters';
const noteFeatureSelector = createFeatureSelector<NoteState>(noteFeatureKey);
const notes = createSelector(noteFeatureSelector, noteAdapter.getSelectors().selectAll);
const entities = createSelector(noteFeatureSelector, noteAdapter.getSelectors().selectEntities);
const ids = createSelector(noteFeatureSelector, noteAdapter.getSelectors().selectIds);
const total = createSelector(noteFeatureSelector, noteAdapter.getSelectors().selectTotal);
const error = createSelector(noteFeatureSelector, (state) => state.error);
const status = createSelector(noteFeatureSelector, (state) => state.status);
export const noteSelector = {
  notes,
  entities,
  ids,
  total,
  error,
  status,
};
