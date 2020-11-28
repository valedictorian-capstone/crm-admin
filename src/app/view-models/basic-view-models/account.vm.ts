import { ActivityVM, NotificationVM, DealVM, RoleVM, TicketVM } from '@view-models';

export interface AccountVM {
  readonly id: string;
  readonly code: string;
  readonly email: string;
  readonly phone: string;
  readonly fullname: string;
  readonly avatar: string;
  readonly assignActivitys: ActivityVM[];
  readonly ownerActivitys: ActivityVM[];
  readonly assignTickets: TicketVM[];
  readonly feedbackAssignTickets: TicketVM[];
  readonly feedbackDeals: DealVM[];
  readonly notifications: NotificationVM[];
  readonly roles: RoleVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AccountCM {
  code: string;
  email: string;
  phone: string;
  fullname: string;
  avatar: string;
  roles: RoleVM[];
}

export interface AccountUM {
  code: string;
  email: string;
  phone: string;
  fullname: string;
  avatar: string;
  roles: RoleVM[];
}
