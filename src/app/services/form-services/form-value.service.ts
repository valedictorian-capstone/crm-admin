import { FormValueCM, FormValueUM, FormValueVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormValueService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<FormValueVM[]> => {
    return this.httpClient.get<FormValueVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].main}`);
  }

  public readonly findById = (id: string): Observable<FormValueVM> => {
    return this.httpClient.get<FormValueVM>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].getById}${id}`);
  }

  public readonly insert = (data: FormValueCM): Observable<FormValueVM> => {
    return this.httpClient.post<FormValueVM>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].main}`, data);
  }

  public readonly update = (data: FormValueUM): Observable<FormValueVM> => {
    return this.httpClient.put<FormValueVM>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].main}`, data);
  }

  public readonly remove = (id: string): Observable<FormValueVM> => {
    return this.httpClient.delete<FormValueVM>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<FormValueVM[]> => {
    return this.httpClient.put<FormValueVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].active}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['form-api']['form-value'].getById}unique?label=${label}&value=${value}`);
  }
}
