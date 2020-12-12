import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@services';
import { AuthAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: AuthService
  ) { }
  // public readonly fetch$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthAction.FetchAction),
  //     switchMap(action =>
  //       this.service.auth(action.device).pipe(
  //
  //         map((res) => AuthAction.FetchSuccessAction(res)),
  //         tap((data) => {
  //           if (action.success) {
  //             action.success(data)
  //           }
  //         }),
  //         catchError((error: Error) => {
  //           if (action.error) {
  //             action.error(error);
  //           }
  //           return of(undefined);
  //         }),
  //         finalize(() => {
  //           if (action.finalize) {
  //             action.finalize();
  //           }
  //         })
  //       )
  //     )
  //   )
  // );
  // public readonly updateProfile$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthAction.UpdateProfileAction),
  //     switchMap(action =>
  //       this.service.updateProfile(action.data).pipe(
  //
  //         map((res) => AuthAction.UpdateProfileSuccessAction(res)),
  //         tap((data) => {
  //           if (action.success) {
  //             action.success(data)
  //           }
  //         }),
  //         catchError((error: Error) => {
  //           if (action.error) {
  //             action.error(error);
  //           }
  //           return of(undefined);
  //         }),
  //         finalize(() => {
  //           if (action.finalize) {
  //             action.finalize();
  //           }
  //         })
  //       )
  //     )
  //   )
  // );
}
