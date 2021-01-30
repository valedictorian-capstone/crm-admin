import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TicketService } from '@services';
import { TicketAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountVM, TicketVM } from '@view-models';

@Injectable()
export class TicketEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: TicketService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.SocketAction),

      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {
            // if (trigger.type === 'create') {
            //   if (this.checkCreate(action.requester, trigger.data as TicketVM)) {
            //     return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
            //   }
            // } else if (trigger.type === 'update') {
            //   if (this.check(action.requester, trigger.data as TicketVM)) {
            //     return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
            //   } else {
            //     return TicketAction.RemoveSuccessAction({ id: (trigger.data as TicketVM).id });
            //   }
            // } else if (trigger.type === 'remove') {
            //   return TicketAction.RemoveSuccessAction({ id: (trigger.data as TicketVM).id });
            // }
            if (trigger.type === 'create') {
              return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
            } else if (trigger.type === 'update') {
              return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
            } else if (trigger.type === 'remove') {
              return TicketAction.RemoveSuccessAction({ id: (trigger.data as TicketVM).id });
            } else if (trigger.type === 'list') {
              return TicketAction.ListAction({ res: trigger.data as TicketVM[] });
            }
            return TicketAction.ListAction({ res: [] });
          }),
          catchError((error: Error) => {
            console.log(error);
            return of(undefined);
          }),
        )
      )
    )
  );
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(

          map(res => TicketAction.FindAllSuccessAction({ res })),
          tap((data) => {
            if (action.success) {
              action.success(data.res)
            }
          }),
          catchError((error: Error) => {
            if (action.error) {
              action.error(error);
            }
            return of(undefined);
          }),
          finalize(() => {
            if (action.finalize) {
              action.finalize();
            }
          })
        )
      )
    )
  );
  private readonly checkCreate = (requester: AccountVM, ticket: TicketVM) => {
    const canGetDealTicket = requester.roles.filter((role) => role.canGetDealTicket).length > 0;
    const canGetSupportTicket = requester.roles.filter((role) => role.canGetSupportTicket).length > 0;
    return (canGetDealTicket && ticket.type === 'deal') || (canGetSupportTicket && ticket.type === 'other');
  }
  private readonly check = (requester: AccountVM, ticket: TicketVM) => {
    const canGetDealTicket = requester.roles.filter((role) => role.canGetDealTicket).length > 0;
    const canGetSupportTicket = requester.roles.filter((role) => role.canGetSupportTicket).length > 0;
    const canGetFeedbackTicket = requester.roles.filter((e) => e.canGetFeedbackTicket).length > 0;
    if (canGetDealTicket && canGetSupportTicket) {
      return true;
    } else if (!canGetDealTicket && !canGetSupportTicket) {
      if (canGetFeedbackTicket && ticket.status === 'resolve' && (ticket.feedbackAssignee ? (ticket.feedbackAssignee.id === requester.id) : true)) {
        return true;
      }
    } else {
      if (canGetDealTicket) {
        if (canGetFeedbackTicket && ((ticket.type === 'deal' && (ticket.assignee ? (ticket.assignee?.id === requester.id) : true)) || (ticket.status === 'resolve' && (ticket.feedbackAssignee ? (ticket.feedbackAssignee.id === requester.id) : true)))) {
          return true;
        } else if (ticket.type === 'deal' && (ticket.assignee ? (ticket.assignee?.id === requester.id) : true)) {
          return true;
        }
      }
      if (canGetSupportTicket) {
        if (canGetFeedbackTicket && ((ticket.type === 'other' && (ticket.assignee ? (ticket.assignee?.id === requester.id) : true)) || (ticket.status === 'resolve' && (ticket.feedbackAssignee ? (ticket.feedbackAssignee.id === requester.id) : true)))) {
          return true;
        } else if (ticket.type === 'other' && (ticket.assignee ? (ticket.assignee?.id === requester.id) : true)) {
          return true;
        }
      }

    }
    return false;
  }
}
