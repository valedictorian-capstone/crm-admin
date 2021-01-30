import { AccountVM, TicketVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface ITicketMainState {
  array: TicketVM[];
  filterArray: TicketVM[];
  paginationArray: TicketVM[];
  type: 'card' | 'datatable';
  max?: number;
  show: boolean;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
  canAdd?: boolean;
  you?: AccountVM;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface ITicketDetailState {
  id: string;
  main: TicketVM;
  you?: AccountVM;
}
