import { AccountVM, DealVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface IDealMainState {
  array: DealVM[];
  filterArray: DealVM[];
  paginationArray: DealVM[];
  you?: AccountVM;
  type: 'card' | 'datatable' | 'kanban';
  max?: number;
  show: boolean;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IDealDetailState {
  id: string;
  main: DealVM;
  you?: AccountVM;
  canUpdate?: boolean;
  canAssign?: boolean;
  canGetAssign?: boolean;
  canGetFeedback?: boolean;
}
