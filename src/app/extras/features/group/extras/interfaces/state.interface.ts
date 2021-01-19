import { FormGroup } from '@angular/forms';
import { ISort } from "@extras/interfaces";
import { AccountVM } from "@view-models";
import { IEmployeeSearch } from ".";

export interface IEmployeeMainState {
  array: Account[];
  filterArray: Account[];
  paginationArray: Account[];
  search: IEmployeeSearch;
  sortBy: ISort;
  you?: AccountVM;
  type: 'card' | 'datatable';
  max?: number;
  active?: number;
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
