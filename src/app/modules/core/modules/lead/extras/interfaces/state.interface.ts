import { CustomerVM, GroupVM, AccountVM } from "@view-models";
import { ILeadSearch } from './search.interface';

export interface ILeadState {
  array: CustomerVM[];
  filterArray: CustomerVM[];
  paginationArray: CustomerVM[];
  search: ILeadSearch;
  you?: AccountVM;
  type: 'card' | 'datatable';
  max?: number;
  active?: number;
  canAdd?: boolean;
  canImport?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}
