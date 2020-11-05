import { ProcessConnectionCM, ProcessConnectionUM, ProcessConnectionVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessConnectionService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProcessConnectionVM[]> => {
    return this.httpClient.get<ProcessConnectionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-connection'].main}`);
  }

  public readonly findById = (id: string): Observable<ProcessConnectionVM> => {
    return this.httpClient.get<ProcessConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-connection'].getById}${id}`);
  }

  public readonly insert = (data: ProcessConnectionCM): Observable<ProcessConnectionVM> => {
    return this.httpClient
      .post<ProcessConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-connection'].main}`, data);
  }

  public readonly update = (data: ProcessConnectionUM): Observable<ProcessConnectionVM> => {
    return this.httpClient
      .put<ProcessConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-connection'].main}`, data);
  }

  public readonly remove = (id: string): Observable<ProcessConnectionVM> => {
    return this.httpClient.delete<ProcessConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-connection'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProcessConnectionVM[]> => {
    return this.httpClient.put<ProcessConnectionVM[]>(`${environment.apiEndpont}
    ${environment.api['bpmn-api']['process-connection'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProcessConnectionVM[]> => {
    return this.httpClient.put<ProcessConnectionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-connection'].deactive}`, ids);
  }
}
