import { AttachmentVM, AccountVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface IAttachmentMainState {
  array: AttachmentVM[];
  filterArray: AttachmentVM[];
  paginationArray: AttachmentVM[];
  type: 'card' | 'datatable';
  max?: number;
  show: boolean;
  you?: AccountVM;
  active?: FormControl;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
  pageCount: number;
}

export interface IAttachmentDetailState {
  id: string;
  main: AttachmentVM;
}
