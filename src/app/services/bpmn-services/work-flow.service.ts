import { WorkFlowCM, WorkFlowUM, WorkFlowVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkFlowService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<WorkFlowVM[]> => {
    return this.httpClient.get<WorkFlowVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].main}`);
  }

  public readonly findById = (id: string): Observable<WorkFlowVM> => {
    return this.httpClient.get<WorkFlowVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].getById}${id}`);
  }

  public readonly insert = (data: WorkFlowCM): Observable<WorkFlowVM> => {
    return this.httpClient
      .post<WorkFlowVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].main}`, data);
  }

  public readonly update = (data: WorkFlowUM): Observable<WorkFlowVM> => {
    return this.httpClient
      .put<WorkFlowVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].main}`, data);
  }

  public readonly remove = (id: string): Observable<WorkFlowVM> => {
    return this.httpClient.delete<WorkFlowVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<WorkFlowVM[]> => {
    return this.httpClient
      .put<WorkFlowVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<WorkFlowVM[]> => {
    return this.httpClient.put<WorkFlowVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['bpmn-api']['work-flow'].getById}unique?label=${label}&value=${value}`);
  }
}
