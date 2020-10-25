import { PermissionCM, PermissionUM, PermissionVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<PermissionVM[]> => {
    return this.httpClient.get<PermissionVM[]>(`${environment.apiEndpont}${environment.api['basic-api'].permission.main}`);
  }

  public readonly findById = (id: string): Observable<PermissionVM> => {
    return this.httpClient.get<PermissionVM>(`${environment.apiEndpont}${environment.api['basic-api'].permission.getById}${id}`);
  }

  public readonly insert = (data: PermissionCM): Observable<PermissionVM> => {
    return this.httpClient.post<PermissionVM>(`${environment.apiEndpont}${environment.api['basic-api'].permission.main}`, data);
  }

  public readonly update = (data: PermissionUM): Observable<PermissionVM> => {
    return this.httpClient.put<PermissionVM>(`${environment.apiEndpont}${environment.api['basic-api'].permission.main}`, data);
  }

  public readonly remove = (id: string): Observable<PermissionVM> => {
    return this.httpClient.delete<PermissionVM>(`${environment.apiEndpont}${environment.api['basic-api'].permission.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<PermissionVM> => {
    return this.httpClient.put<PermissionVM>(`${environment.apiEndpont}${environment.api['basic-api'].permission.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<PermissionVM> => {
    return this.httpClient.put<PermissionVM>(`${environment.apiEndpont}${environment.api['basic-api'].permission.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['basic-api'].permission.getById}unique?label=${label}&value=${value}`);
  }
}
