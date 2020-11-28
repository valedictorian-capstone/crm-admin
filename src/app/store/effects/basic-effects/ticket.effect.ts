import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TicketService } from '@services';
import { TicketAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class TicketEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: TicketService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(tickets => TicketAction.useFindAllSuccessAction({ tickets, status: action.status })),
          catchError(async (error) => TicketAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.ticket).pipe(
          delay(1000),
          map(ticket => TicketAction.useCreateSuccessAction({ ticket, status: action.status })),
          catchError(async (error) => TicketAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.ticket).pipe(
          delay(1000),
          map(ticket => TicketAction.useUpdateSuccessAction({ ticket, status: action.status })),
          catchError(async (error) => TicketAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TicketAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => TicketAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => TicketAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
