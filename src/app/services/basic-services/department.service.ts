import { DepartmentCM, DepartmentUM, DepartmentVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<DepartmentVM[]> => {
    return this.httpClient.get<DepartmentVM[]>(`${environment.apiEndpont}${environment.api['basic-api'].department.main}`);
  }

  public readonly findById = (id: string): Observable<DepartmentVM> => {
    return this.httpClient.get<DepartmentVM>(`${environment.apiEndpont}${environment.api['basic-api'].department.getById}${id}`);
  }

  public readonly insert = (data: DepartmentCM): Observable<DepartmentVM> => {
    return this.httpClient.post<DepartmentVM>(`${environment.apiEndpont}${environment.api['basic-api'].department.main}`, data);
  }

  public readonly update = (data: DepartmentUM): Observable<DepartmentVM> => {
    return this.httpClient.put<DepartmentVM>(`${environment.apiEndpont}${environment.api['basic-api'].department.main}`, data);
  }

  public readonly remove = (id: string): Observable<DepartmentVM> => {
    return this.httpClient.delete<DepartmentVM>(`${environment.apiEndpont}${environment.api['basic-api'].department.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<DepartmentVM> => {
    return this.httpClient.put<DepartmentVM>(`${environment.apiEndpont}${environment.api['basic-api'].department.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<DepartmentVM> => {
    return this.httpClient.put<DepartmentVM>(`${environment.apiEndpont}${environment.api['basic-api'].department.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['basic-api'].department.getById}unique?label=${label}&value=${value}`);
  }
}
