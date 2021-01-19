import { AccountVM, ActivityVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';
import { FormControl } from '@angular/forms';

export interface IActivityMainState {
  array: (CalendarEvent & ActivityVM & { state: string })[];
  filterArray: (CalendarEvent & ActivityVM & { state: string })[];
  paginationArray: (CalendarEvent & ActivityVM & { state: string })[];
  show: boolean;
  you?: AccountVM;
  type: 'card' | 'datatable' | 'calendar';
  max?: number;
  pageCount: number;
  active?: FormControl;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IActivityDetailState {
  id: string;
  main: (CalendarEvent & ActivityVM & { state: string });
  you?: AccountVM;
}
