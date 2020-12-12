import { createAction, props } from '@ngrx/store';
import { AccountVM, DeviceVM } from '@view-models';
const FetchAction = createAction(
  '[Auth] Fetch Action',
  props < {
    device: DeviceVM | undefined,
    success?: (res: AccountVM) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  } > ()
);
const FetchSuccessAction = createAction(
  '[Auth] Fetch Action Success',
  props<AccountVM>()
);
const UpdateProfileAction = createAction(
  '[Auth] Update Profile Action',
  props < {
    data: AccountVM,
    success?: (res: AccountVM) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  } > ()
);
const UpdateProfileSuccessAction = createAction(
  '[Auth] Update Profile Action Success',
  props<AccountVM>()
);
const ResetAction = createAction(
  '[Auth] Reset Action',
);
export const AuthAction = {
  FetchAction,
  FetchSuccessAction,
  UpdateProfileAction,
  UpdateProfileSuccessAction,
  ResetAction
};
