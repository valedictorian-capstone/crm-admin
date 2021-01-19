import { AccountVM, PipelineVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface IPipelineMainState {
  array: PipelineVM[];
  filterArray: PipelineVM[];
  paginationArray: PipelineVM[];
  type: 'card' | 'datatable';
  max?: number;
  show: boolean;
  active?: FormControl;
  pageCount: number;
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface IPipelineDetailState {
  id: string;
  main: PipelineVM;
  you?: AccountVM;
}
