import { WorkFlowStepCM, WorkFlowStepUM, WorkFlowStepVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowStepService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<WorkFlowStepVM[]> => {
    return this.httpClient.get<WorkFlowStepVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].main}`);
  }

  public readonly findById = (id: string): Observable<WorkFlowStepVM> => {
    return this.httpClient.get<WorkFlowStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].getById}${id}`);
  }

  public readonly insert = (data: WorkFlowStepCM): Observable<WorkFlowStepVM> => {
    return this.httpClient
      .post<WorkFlowStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].main}`, data);
  }

  public readonly update = (data: WorkFlowStepUM): Observable<WorkFlowStepVM> => {
    return this.httpClient
      .put<WorkFlowStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].main}`, data);
  }

  public readonly remove = (id: string): Observable<WorkFlowStepVM> => {
    return this.httpClient.delete<WorkFlowStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<WorkFlowStepVM[]> => {
    return this.httpClient
      .put<WorkFlowStepVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<WorkFlowStepVM[]> => {
    return this.httpClient.put<WorkFlowStepVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow-step'].deactive}`, ids);
  }
}
