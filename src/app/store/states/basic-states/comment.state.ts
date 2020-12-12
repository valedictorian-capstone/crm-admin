import { EntityState } from '@ngrx/entity';
import { CommentVM } from '@view-models';

export interface CommentState extends EntityState<CommentVM> {
  firstLoad: boolean;
}
