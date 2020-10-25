import { WorkFlowConnectionCM, WorkFlowConnectionUM, WorkFlowConnectionVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowConnectionService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<WorkFlowConnectionVM[]> => {
    return this.httpClient.get<WorkFlowConnectionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].main}`);
  }

  public readonly findById = (id: string): Observable<WorkFlowConnectionVM> => {
    return this.httpClient.get<WorkFlowConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].getById}${id}`);
  }

  public readonly insert = (data: WorkFlowConnectionCM): Observable<WorkFlowConnectionVM> => {
    return this.httpClient
      .post<WorkFlowConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].main}`, data);
  }

  public readonly update = (data: WorkFlowConnectionUM): Observable<WorkFlowConnectionVM> => {
    return this.httpClient
      .put<WorkFlowConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].main}`, data);
  }

  public readonly remove = (id: string): Observable<WorkFlowConnectionVM> => {
    return this.httpClient.delete<WorkFlowConnectionVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<WorkFlowConnectionVM[]> => {
    return this.httpClient.put<WorkFlowConnectionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<WorkFlowConnectionVM[]> => {
    return this.httpClient.put<WorkFlowConnectionVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-connection'].deactive}`, ids);
  }
}
