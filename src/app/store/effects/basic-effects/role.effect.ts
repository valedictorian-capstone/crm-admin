import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RoleService } from '@services';
import { RoleAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class RoleEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: RoleService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(roles => RoleAction.useFindAllSuccessAction({ roles, status: action.status })),
          catchError(async (error) => RoleAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.role).pipe(
          delay(1000),
          map(role => RoleAction.useCreateSuccessAction({ role, status: action.status })),
          catchError(async (error) => RoleAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.role).pipe(
          delay(1000),
          map(role => RoleAction.useUpdateSuccessAction({ role, status: action.status })),
          catchError(async (error) => RoleAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => RoleAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => RoleAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
