import { FormControl } from '@angular/forms';
import { CategoryVM } from '@view-models';

export interface ICategoryMainState {
  array: CategoryVM[];
  filterArray: CategoryVM[];
  paginationArray: CategoryVM[];
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

export interface ICategoryDetailState {
  id: string;
  main: CategoryVM;
}
