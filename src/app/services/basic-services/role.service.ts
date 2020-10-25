import { RoleCM, RoleUM, RoleVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<RoleVM[]> => {
    return this.httpClient.get<RoleVM[]>(`${environment.apiEndpont}${environment.api['basic-api'].role.main}`);
  }

  public readonly findById = (id: string): Observable<RoleVM> => {
    return this.httpClient.get<RoleVM>(`${environment.apiEndpont}${environment.api['basic-api'].role.getById}${id}`);
  }

  public readonly insert = (data: RoleCM): Observable<RoleVM> => {
    return this.httpClient.post<RoleVM>(`${environment.apiEndpont}${environment.api['basic-api'].role.main}`, data);
  }

  public readonly update = (data: RoleUM): Observable<RoleVM> => {
    return this.httpClient.put<RoleVM>(`${environment.apiEndpont}${environment.api['basic-api'].role.main}`, data);
  }

  public readonly remove = (id: string): Observable<RoleVM> => {
    return this.httpClient.delete<RoleVM>(`${environment.apiEndpont}${environment.api['basic-api'].role.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<RoleVM> => {
    return this.httpClient.put<RoleVM>(`${environment.apiEndpont}${environment.api['basic-api'].role.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<RoleVM> => {
    return this.httpClient.put<RoleVM>(`${environment.apiEndpont}${environment.api['basic-api'].role.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['basic-api'].role.getById}unique?label=${label}&value=${value}`);
  }
}
