import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoleCM, RoleUM, RoleVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: RoleVM | RoleVM[]
  }> => {
    return this.socket.fromEvent('roles');
  }

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
