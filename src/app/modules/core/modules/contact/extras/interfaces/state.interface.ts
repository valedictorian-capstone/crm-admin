import { CustomerVM, GroupVM, AccountVM } from "@view-models";
import { FormGroup } from '@angular/forms';
import { IContactSort, IContactSearch } from ".";

export interface IContactMainState {
  array: CustomerVM[];
  filterArray: CustomerVM[];
  paginationArray: CustomerVM[];
  search: IContactSearch;
  sortBy: IContactSort;
  you?: AccountVM;
  type: 'card' | 'datatable';
  max?: number;
  active?: number;
  canAdd?: boolean;
  canImport?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IContactImportState {
  max?: number;
  active?: number;
  data: { name: string, array: FormGroup[] }[];
  array: FormGroup[];
  paginationArray: FormGroup[];
}
