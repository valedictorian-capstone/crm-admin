import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { CommentState } from '@states';
import { CommentVM } from '@view-models';
export const commentAdapter: EntityAdapter<CommentVM> = createEntityAdapter<CommentVM>();

export const commentInitialState: CommentState = commentAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
