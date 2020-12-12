import { EntityState } from '@ngrx/entity';
import { NoteVM } from '@view-models';

export interface NoteState extends EntityState<NoteVM> {
  firstLoad: boolean;
}
