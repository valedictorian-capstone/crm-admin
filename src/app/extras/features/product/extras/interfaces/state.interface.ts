import { AccountVM, ProductVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface IProductMainState {
  array: ProductVM[];
  filterArray: ProductVM[];
  paginationArray: ProductVM[];
  type: 'card' | 'datatable';
  max?: number;
  show: boolean;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
  canImport?: boolean;
}

export interface IProductDetailState {
  id: string;
  canUpdate?: boolean;
  main: ProductVM;
  you?: AccountVM;
}
