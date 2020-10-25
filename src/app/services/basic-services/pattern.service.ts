import { PatternCM, PatternUM, PatternVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatternService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<PatternVM[]> => {
    return this.httpClient.get<PatternVM[]>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.main}`);
  }

  public readonly findById = (id: string): Observable<PatternVM> => {
    return this.httpClient.get<PatternVM>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.getById}${id}`);
  }

  public readonly insert = (data: PatternCM): Observable<PatternVM> => {
    return this.httpClient.post<PatternVM>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.main}`, data);
  }

  public readonly update = (data: PatternUM): Observable<PatternVM> => {
    return this.httpClient.put<PatternVM>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.main}`, data);
  }

  public readonly remove = (id: string): Observable<PatternVM> => {
    return this.httpClient.delete<PatternVM>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<PatternVM> => {
    return this.httpClient.put<PatternVM>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<PatternVM> => {
    return this.httpClient.put<PatternVM>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['basic-api'].pattern.getById}unique?label=${label}&value=${value}`);
  }
}
