import { ProcessStepCM, ProcessStepUM, ProcessStepVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessStepService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProcessStepVM[]> => {
    return this.httpClient.get<ProcessStepVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].main}`);
  }

  public readonly findById = (id: string): Observable<ProcessStepVM> => {
    return this.httpClient.get<ProcessStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].getById}${id}`);
  }

  public readonly insert = (data: ProcessStepCM): Observable<ProcessStepVM> => {
    return this.httpClient
      .post<ProcessStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].main}`, data);
  }

  public readonly update = (data: ProcessStepUM): Observable<ProcessStepVM> => {
    return this.httpClient
      .put<ProcessStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].main}`, data);
  }

  public readonly remove = (id: string): Observable<ProcessStepVM> => {
    return this.httpClient.delete<ProcessStepVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProcessStepVM[]> => {
    return this.httpClient
      .put<ProcessStepVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProcessStepVM[]> => {
    return this.httpClient.put<ProcessStepVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-step'].deactive}`, ids);
  }
}
