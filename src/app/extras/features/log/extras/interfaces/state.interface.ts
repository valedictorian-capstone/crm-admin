import { FormControl } from '@angular/forms';
import { AccountVM, LogVM } from '@view-models';

export interface ILogMainState {
  array: LogVM[];
  type: 'card' | 'datatable';
  show: boolean;
  paginationArray: LogVM[];
  max?: number;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
}

export interface ILogDetailState {
  id: string;
  main: LogVM;
  you?: AccountVM;
}
