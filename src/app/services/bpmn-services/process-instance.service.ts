import { ProcessInstanceCM, ProcessInstanceUM, ProcessInstanceVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessInstanceService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProcessInstanceVM[]> => {
    return this.httpClient.get<ProcessInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].main}`);
  }

  public readonly findById = (id: string): Observable<ProcessInstanceVM> => {
    return this.httpClient
      .get<ProcessInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].getById}${id}`);
  }

  public readonly insert = (data: ProcessInstanceCM): Observable<ProcessInstanceVM> => {
    return this.httpClient
      .post<ProcessInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].main}`, data);
  }

  public readonly update = (data: ProcessInstanceUM): Observable<ProcessInstanceVM> => {
    return this.httpClient
      .put<ProcessInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].main}`, data);
  }

  public readonly remove = (id: string): Observable<ProcessInstanceVM> => {
    return this.httpClient.delete<ProcessInstanceVM>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProcessInstanceVM[]> => {
    return this.httpClient
      .put<ProcessInstanceVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProcessInstanceVM[]> => {
    return this.httpClient.put<ProcessInstanceVM[]>(`${environment.apiEndpont}
    ${environment.api['bpmn-api']['process-instance'].deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['bpmn-api']['process-instance'].getById}unique?label=${label}&value=${value}`);
  }
}
