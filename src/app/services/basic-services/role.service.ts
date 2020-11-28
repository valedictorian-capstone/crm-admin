import { RoleCM, RoleUM, RoleVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: RoleVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<RoleVM[]> => {
    return this.httpClient.get<RoleVM[]>(`${environment.apiEndpont}${environment.api.basic.role.main}`);
  }

  public readonly findById = (id: string): Observable<RoleVM> => {
    return this.httpClient.get<RoleVM>(`${environment.apiEndpont}${environment.api.basic.role.getById}${id}`);
  }

  public readonly insert = (data: RoleCM): Observable<RoleVM> => {
    return this.httpClient.post<RoleVM>(`${environment.apiEndpont}${environment.api.basic.role.main}`, data);
  }

  public readonly update = (data: RoleUM): Observable<RoleVM> => {
    return this.httpClient.put<RoleVM>(`${environment.apiEndpont}${environment.api.basic.role.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.role.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<RoleVM> => {
    return this.httpClient.put<RoleVM>(`${environment.apiEndpont}${environment.api.basic.role.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<RoleVM> => {
    return this.httpClient.put<RoleVM>(`${environment.apiEndpont}${environment.api.basic.role.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.basic.role.getById}unique?label=${label}&value=${value}`);
  }
}
