import { ProcessStepInstanceCM, ProcessStepInstanceUM, ProcessStepInstanceVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessStepInstanceService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProcessStepInstanceVM[]> => {
    return this.httpClient.get<ProcessStepInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].main}`);
  }

  public readonly findById = (id: string): Observable<ProcessStepInstanceVM> => {
    return this.httpClient.get<ProcessStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].getById}${id}`);
  }

  public readonly insert = (data: ProcessStepInstanceCM): Observable<ProcessStepInstanceVM> => {
    return this.httpClient
      .post<ProcessStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].main}`, data);
  }

  public readonly update = (data: ProcessStepInstanceUM): Observable<ProcessStepInstanceVM> => {
    return this.httpClient
      .put<ProcessStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].main}`, data);
  }

  public readonly remove = (id: string): Observable<ProcessStepInstanceVM> => {
    return this.httpClient.delete<ProcessStepInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProcessStepInstanceVM[]> => {
    return this.httpClient
      .put<ProcessStepInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProcessStepInstanceVM[]> => {
    return this.httpClient.put<ProcessStepInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step-instance'].deactive}`, ids);
  }
}
