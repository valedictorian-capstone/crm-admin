import { AccountVM, CommentVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface ICommentMainState {
  array: CommentVM[];
  filterArray: CommentVM[];
  paginationArray: CommentVM[];
  you?: AccountVM;
  show: boolean,
  type: 'card' | 'datatable' | 'calendar';
  max?: number;
  pageCount: number;
  active?: FormControl;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface ICommentDetailState {
  id: string;
  main: CommentVM;
  you?: AccountVM;
}
