import { WorkFlowStepInstanceCM, WorkFlowStepInstanceUM, WorkFlowStepInstanceVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowStepInstanceService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<WorkFlowStepInstanceVM[]> => {
    return this.httpClient.get<WorkFlowStepInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].main}`);
  }

  public readonly findById = (id: string): Observable<WorkFlowStepInstanceVM> => {
    return this.httpClient.get<WorkFlowStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].getById}${id}`);
  }

  public readonly insert = (data: WorkFlowStepInstanceCM): Observable<WorkFlowStepInstanceVM> => {
    return this.httpClient
      .post<WorkFlowStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].main}`, data);
  }

  public readonly update = (data: WorkFlowStepInstanceUM): Observable<WorkFlowStepInstanceVM> => {
    return this.httpClient
      .put<WorkFlowStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].main}`, data);
  }

  public readonly remove = (id: string): Observable<WorkFlowStepInstanceVM> => {
    return this.httpClient.delete<WorkFlowStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<WorkFlowStepInstanceVM[]> => {
    return this.httpClient
      .put<WorkFlowStepInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<WorkFlowStepInstanceVM[]> => {
    return this.httpClient.put<WorkFlowStepInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step-instance'].deactive}`, ids);
  }
}
