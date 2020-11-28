import { EntityState } from '@ngrx/entity';
import { NoteVM } from '@view-models';

export interface NoteState extends EntityState<NoteVM> {
  status: string;
  error: string;
}
