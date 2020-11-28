import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AccountService } from '@services';
import { AccountAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class AccountEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: AccountService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(accounts => AccountAction.useFindAllSuccessAction({ accounts, status: action.status })),
          catchError(async (error) => AccountAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.account).pipe(
          delay(1000),
          map(account => AccountAction.useCreateSuccessAction({ account, status: action.status })),
          catchError(async (error) => AccountAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.account).pipe(
          delay(1000),
          map(account => AccountAction.useUpdateSuccessAction({ account, status: action.status })),
          catchError(async (error) => AccountAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => AccountAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => AccountAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly unique$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountAction.useUniqueAction),
      switchMap(action =>
        this.service.checkUnique(action.data.label, action.data.value).pipe(
          delay(1000),
          map(result => AccountAction.useUniqueSuccessAction({ result, status: action.status })),
          catchError(async (error) => AccountAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
