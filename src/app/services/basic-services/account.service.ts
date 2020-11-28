import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AccountCM, AccountUM, AccountVM } from '@view-models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: AccountVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<AccountVM[]> => {
    return this.httpClient.get<AccountVM[]>(`${environment.apiEndpont}${environment.api.basic.account.main}`);
  }

  public readonly findById = (id: string): Observable<AccountVM> => {
    return this.httpClient.get<AccountVM>(`${environment.apiEndpont}${environment.api.basic.account.getById}${id}`);
  }

  public readonly import = (data: AccountCM[]): Observable<AccountVM[]> => {
    return this.httpClient.post<AccountVM[]>(`${environment.apiEndpont}${environment.api.basic.account.main}/import`, data);
  }

  public readonly insert = (data: AccountCM): Observable<AccountVM> => {
    return this.httpClient.post<AccountVM>(`${environment.apiEndpont}${environment.api.basic.account.main}`, data);
  }

  public readonly update = (data: AccountUM): Observable<AccountVM> => {
    return this.httpClient.put<AccountVM>(`${environment.apiEndpont}${environment.api.basic.account.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.account.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<AccountVM> => {
    return this.httpClient.put<AccountVM>(`${environment.apiEndpont}${environment.api.basic.account.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<AccountVM> => {
    return this.httpClient.put<AccountVM>(`${environment.apiEndpont}${environment.api.basic.account.deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api.basic.account.getById}unique?label=${label}&value=${value}`);
  }
}
