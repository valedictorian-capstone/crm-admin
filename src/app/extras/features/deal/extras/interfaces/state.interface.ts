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
  canAssign?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IDealDetailState {
  id: string;
  main: DealVM;
  you?: AccountVM;
  canUpdateFeedback?: boolean;
  canUpdate?: boolean;
  canAssign?: boolean;
  canGetAll?: boolean;
  canGetAssign?: boolean;
  canAccessCampaign?: boolean;
  canGetFeedback?: boolean;
}
