import { NbIconConfig } from '@nebular/theme';
import { AccountVM } from '@view-models';

export interface ActionMenuItem {
  readonly label: string;
  readonly value: string;
  readonly icon: NbIconConfig;
  readonly textColor: 'text-info' | 'text-primary' | 'text-danger' | 'text-default' | 'text-warning' | 'text-success';
  readonly isProfile?: boolean;
  readonly avatar?: string;
  readonly name?: string;
}
