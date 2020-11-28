import { EntityState } from '@ngrx/entity';
import { TicketVM } from '@view-models';

export interface TicketState extends EntityState<TicketVM> {
  status: string;
  error: string;
}
