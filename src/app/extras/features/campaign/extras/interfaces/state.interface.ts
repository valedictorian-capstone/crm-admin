import { AccountVM, CampaignVM } from '@view-models';
import { FormControl } from '@angular/forms';

export interface ICampaignMainState {
  array: CampaignVM[];
  filterArray: CampaignVM[];
  paginationArray: CampaignVM[];
  you?: AccountVM;
  type: 'card' | 'datatable';
  max?: number;
  show: boolean;
  active?: FormControl;
  pageCount: number
  firstLoad?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canRemove?: boolean;
}

export interface ICampaignDetailState {
  id: string;
  main: CampaignVM;
  you?: AccountVM;
}
