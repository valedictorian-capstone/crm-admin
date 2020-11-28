import {
  Data,
  ParamMap, Params, RouterStateSnapshot
} from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterState } from '@store/states';

export class AppSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    const { url } = routerState;
    const { queryParamMap, queryParams, params, fragment, data, paramMap, } =
      routerState.root.firstChild
        ? routerState.root.firstChild
        : routerState.root;
    return {
      url,
      queryParams,
      params,
      fragment,
      data,
      paramMap,
      queryParamMap
    };
  }
}
