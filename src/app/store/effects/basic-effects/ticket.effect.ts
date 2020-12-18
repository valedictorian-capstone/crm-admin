import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TicketService } from '@services';
import { TicketAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { TicketVM } from '@view-models';

@Injectable()
export class TicketEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: TicketService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.SocketAction),
      tap(() => console.log('socket')),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          tap((data) => console.log('test', data)),

          map(trigger => {
            console.log('effect-socket', trigger);
            if (trigger.type === 'create') {
              const canGetTicketDeal = action.requester.roles.filter((role) => role.canGetTicketDeal).length > 0;
              const canGetTicketSupport = action.requester.roles.filter((role) => role.canGetTicketSupport).length > 0;
              if ((trigger.data as TicketVM).type === 'deal' && canGetTicketDeal) {
                return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
              }
              if ((trigger.data as TicketVM).type === 'other' && canGetTicketSupport) {
                return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
              }
            } else if (trigger.type === 'update') {
              if ((trigger.data as TicketVM).assignee) {
                if ((trigger.data as TicketVM).assignee.id === action.requester.id) {
                  return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
                } else {
                  return TicketAction.RemoveSuccessAction({ id: (trigger.data as TicketVM).id });
                }
              } else {
                return TicketAction.SaveSuccessAction({ res: trigger.data as TicketVM });
              }
            } else if (trigger.type === 'remove') {
              return TicketAction.RemoveSuccessAction({ id: (trigger.data as TicketVM).id });
            }
          }),
          catchError((error: Error) => {
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
}
