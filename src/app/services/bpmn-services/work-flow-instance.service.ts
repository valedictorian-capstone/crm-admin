import { WorkFlowInstanceCM, WorkFlowInstanceUM, WorkFlowInstanceVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowInstanceService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<WorkFlowInstanceVM[]> => {
    return this.httpClient.get<WorkFlowInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].main}`);
  }

  public readonly findById = (id: string): Observable<WorkFlowInstanceVM> => {
    return this.httpClient.get<WorkFlowInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].getById}${id}`);
  }

  public readonly insert = (data: WorkFlowInstanceCM): Observable<WorkFlowInstanceVM> => {
    return this.httpClient
      .post<WorkFlowInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].main}`, data);
  }

  public readonly update = (data: WorkFlowInstanceUM): Observable<WorkFlowInstanceVM> => {
    return this.httpClient
      .put<WorkFlowInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].main}`, data);
  }

  public readonly remove = (id: string): Observable<WorkFlowInstanceVM> => {
    return this.httpClient.delete<WorkFlowInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<WorkFlowInstanceVM[]> => {
    return this.httpClient
      .put<WorkFlowInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<WorkFlowInstanceVM[]> => {
    return this.httpClient.put<WorkFlowInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-instance'].getById}unique?label=${label}&value=${value}`);
  }
}
