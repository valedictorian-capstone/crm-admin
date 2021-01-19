import { FormGroup, FormControl } from '@angular/forms';
import { AccountVM, CustomerVM } from "@view-models";

export interface ICustomerMainState {
  array: CustomerVM[];
  filterArray: CustomerVM[];
  paginationArray: CustomerVM[];
  you?: AccountVM;
  type: 'card' | 'datatable';
  max?: number;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
  show?: boolean;
  canAdd?: boolean;
  canImport?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface ICustomerImportState {
  max?: number;
  active?: number;
  data: { name: string, array: FormGroup[] }[];
  array: FormGroup[];
  paginationArray: FormGroup[];
}
