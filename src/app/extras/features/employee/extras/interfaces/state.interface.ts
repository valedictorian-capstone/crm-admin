import { FormControl, FormGroup } from '@angular/forms';
import { AccountVM } from "@view-models";

export interface IEmployeeMainState {
  array: AccountVM[];
  filterArray: AccountVM[];
  paginationArray: AccountVM[];
  you?: AccountVM;
  type: 'card' | 'datatable';
  max?: number;
  active?: FormControl;
  pageCount: number;
  show?: boolean;
  firstLoad?: boolean;
  canAdd?: boolean;
  canImport?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IEmployeeImportState {
  max?: number;
  active?: number;
  data: { name: string, array: FormGroup[] }[];
  array: FormGroup[];
  paginationArray: FormGroup[];
}
