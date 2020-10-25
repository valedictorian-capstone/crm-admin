import { FormGroupCM, FormGroupUM, FormGroupVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormGroupService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<FormGroupVM[]> => {
    return this.httpClient.get<FormGroupVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].main}`);
  }

  public readonly findById = (id: string): Observable<FormGroupVM> => {
    return this.httpClient.get<FormGroupVM>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].getById}${id}`);
  }

  public readonly insert = (data: FormGroupCM): Observable<FormGroupVM> => {
    return this.httpClient.post<FormGroupVM>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].main}`, data);
  }

  public readonly update = (data: FormGroupUM): Observable<FormGroupVM> => {
    return this.httpClient.put<FormGroupVM>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].main}`, data);
  }

  public readonly remove = (id: string): Observable<FormGroupVM> => {
    return this.httpClient.delete<FormGroupVM>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<FormGroupVM[]> => {
    return this.httpClient.put<FormGroupVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].active}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['form-api']['form-group'].getById}unique?label=${label}&value=${value}`);
  }
}
