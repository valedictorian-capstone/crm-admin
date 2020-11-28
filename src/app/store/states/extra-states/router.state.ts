import {
  Data,
  ParamMap, Params, RouterStateSnapshot
} from '@angular/router';
export interface RouterState {
  url: string;
  params: Params;
  queryParams: Params;
  fragment: string;
  data: Data;
  paramMap: ParamMap;
  queryParamMap: ParamMap;
}
