import { GroupVM } from "@view-models";

export interface IGroupMainState {
  array: GroupVM[];
  filterArray: GroupVM[];
  paginationArray: GroupVM[];
  type: 'card' | 'datatable';
  max?: number;
  active?: number;
  canAdd?: boolean;
  canImport?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}
