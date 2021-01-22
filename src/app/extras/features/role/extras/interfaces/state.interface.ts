import { AccountVM, RoleVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface IRoleMainState {
  array: RoleVM[];
  filterArray: RoleVM[];
  paginationArray: RoleVM[];
  type: 'card' | 'datatable';
  max?: number;
  show: boolean;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IRoleDetailState {
  id: string;
  main: RoleVM;
  you?: AccountVM;
}
