import { FormControlCM, FormControlUM, FormControlVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<FormControlVM[]> => {
    return this.httpClient.get<FormControlVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].main}`);
  }

  public readonly findById = (id: string): Observable<FormControlVM> => {
    return this.httpClient.get<FormControlVM>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].getById}${id}`);
  }

  public readonly insert = (data: FormControlCM): Observable<FormControlVM> => {
    return this.httpClient.post<FormControlVM>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].main}`, data);
  }

  public readonly update = (data: FormControlUM): Observable<FormControlVM> => {
    return this.httpClient.put<FormControlVM>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].main}`, data);
  }

  public readonly remove = (id: string): Observable<FormControlVM> => {
    return this.httpClient.delete<FormControlVM>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<FormControlVM[]> => {
    return this.httpClient.put<FormControlVM[]>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].active}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['form-api']['form-control'].getById}unique?label=${label}&value=${value}`);
  }
}
