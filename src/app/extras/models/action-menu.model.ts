import { NbIconConfig } from '@nebular/theme';

export interface ActionMenuItem {
  readonly label: string;
  readonly value: string;
  readonly icon: NbIconConfig;
  readonly textColor: 'text-info' | 'text-primary' | 'text-danger' | 'text-default' | 'text-warning';
}
