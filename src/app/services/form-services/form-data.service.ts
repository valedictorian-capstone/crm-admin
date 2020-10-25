import { FormDataCM, FormDataUM, FormDataVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<FormDataVM[]> => {
    return this.httpClient.get<FormDataVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].main}`);
  }

  public readonly findById = (id: string): Observable<FormDataVM> => {
    return this.httpClient.get<FormDataVM>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].getById}${id}`);
  }

  public readonly insert = (data: FormDataCM): Observable<FormDataVM> => {
    return this.httpClient.post<FormDataVM>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].main}`, data);
  }

  public readonly update = (data: FormDataUM): Observable<FormDataVM> => {
    return this.httpClient.put<FormDataVM>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].main}`, data);
  }

  public readonly remove = (id: string): Observable<FormDataVM> => {
    return this.httpClient.delete<FormDataVM>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<FormDataVM[]> => {
    return this.httpClient.put<FormDataVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].active}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['form-api']['form-data'].getById}unique?label=${label}&value=${value}`);
  }
}
