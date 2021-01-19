import { EntityState } from '@ngrx/entity';
import { CampaignVM } from '@view-models';

export interface CampaignState extends EntityState<CampaignVM> {
  firstLoad: boolean;
}
