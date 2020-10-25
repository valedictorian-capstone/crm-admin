import { ConditionCM, ConditionUM, ConditionVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConditionService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ConditionVM[]> => {
    return this.httpClient.get<ConditionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.main}`);
  }

  public readonly findById = (id: string): Observable<ConditionVM> => {
    return this.httpClient.get<ConditionVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.getById}${id}`);
  }

  public readonly insert = (data: ConditionCM): Observable<ConditionVM> => {
    return this.httpClient.post<ConditionVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.main}`, data);
  }

  public readonly update = (data: ConditionUM): Observable<ConditionVM> => {
    return this.httpClient.put<ConditionVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.main}`, data);
  }

  public readonly remove = (id: string): Observable<ConditionVM> => {
    return this.httpClient.delete<ConditionVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ConditionVM[]> => {
    return this.httpClient.put<ConditionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ConditionVM[]> => {
    return this.httpClient.put<ConditionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].condition.deactive}`, ids);
  }
}
