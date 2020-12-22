import { createReducer, on } from '@ngrx/store';
import { commentAdapter, commentInitialState } from '@adapters';
import { CommentAction } from '@actions';
import { CommentState } from '@states';
export const commentFeatureKey = 'comment';
export const commentReducer = createReducer(
  commentInitialState,
  on(CommentAction.FindAllSuccessAction,
    (state, action) => commentAdapter.setAll<CommentState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(CommentAction.SaveSuccessAction,
    (state, action) => commentAdapter.upsertOne<CommentState>(action.res, {
      ...state,
    })
  ),
  on(CommentAction.RemoveSuccessAction,
    (state, action) => commentAdapter.removeOne<CommentState>(action.id, {
      ...state,
    })
  ),
    on(CommentAction.ListAction,
    (state, action) => commentAdapter.upsertMany<CommentState>(action.res, {
      ...state,
    })
  ),
  on(CommentAction.ResetAction,
    () => commentAdapter.setAll<CommentState>([], commentInitialState)
  ),
);
