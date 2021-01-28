import { ActivityVM, NotificationVM, DealVM, RoleVM, TicketVM } from '@view-models';

export interface AccountVM {
  id: string;
  code: string;
  email: string;
  phone: string;
  fullname: string;
  avatar: string;
  assignActivitys: ActivityVM[];
  ownerActivitys: ActivityVM[];
  assignTickets: TicketVM[];
  feedbackAssignTickets: TicketVM[];
  deals: DealVM[];
  notifications: NotificationVM[];
  roles: RoleVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
