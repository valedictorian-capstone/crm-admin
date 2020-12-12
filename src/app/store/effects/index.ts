export * from './basic-effects';
export * from './deal-effects';
export * from './extra-effects';
import {
  AccountEffect,
  CategoryEffect,
  CustomerEffect,
  ProductEffect,
  RoleEffect,
  TicketEffect,
  CommentEffect,
  DeviceEffect,
  EventEffect,
  NotificationEffect,
  GroupEffect
} from './basic-effects';
import {
  ActivityEffect,
  AttachmentEffect,
  DealDetailEffect,
  DealEffect,
  NoteEffect,
  PipelineEffect,
  StageEffect,
} from './deal-effects';
import { AuthEffect } from './extra-effects';
export const effects = [
  AccountEffect,
  CategoryEffect,
  CustomerEffect,
  ProductEffect,
  RoleEffect,
  TicketEffect,
  CommentEffect,
  DeviceEffect,
  EventEffect,
  GroupEffect,
  NotificationEffect,
  ActivityEffect,
  AttachmentEffect,
  DealDetailEffect,
  DealEffect,
  NoteEffect,
  PipelineEffect,
  StageEffect,
  AuthEffect
];
