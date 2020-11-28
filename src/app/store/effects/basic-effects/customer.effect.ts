import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CustomerService } from '@services';
import { CustomerAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class CustomerEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: CustomerService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(customers => CustomerAction.useFindAllSuccessAction({ customers, status: action.status })),
          catchError(async (error) => CustomerAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.customer).pipe(
          delay(1000),
          map(customer => CustomerAction.useCreateSuccessAction({ customer, status: action.status })),
          catchError(async (error) => CustomerAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.customer).pipe(
          delay(1000),
          map(customer => CustomerAction.useUpdateSuccessAction({ customer, status: action.status })),
          catchError(async (error) => CustomerAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => CustomerAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => CustomerAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly unique$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.useUniqueAction),
      switchMap(action =>
        this.service.checkUnique(action.data.label, action.data.value).pipe(
          delay(1000),
          map(result => CustomerAction.useUniqueSuccessAction({ result, status: action.status })),
          catchError(async (error) => CustomerAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
