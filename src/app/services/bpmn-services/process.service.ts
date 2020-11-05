import { ProcessCM, ProcessUM, ProcessVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProcessVM[]> => {
    return this.httpClient.get<ProcessVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.main}`);
  }

  public readonly findById = (id: string): Observable<ProcessVM> => {
    return this.httpClient.get<ProcessVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.getById}${id}`);
  }

  public readonly insert = (data: ProcessCM): Observable<ProcessVM> => {
    return this.httpClient
      .post<ProcessVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.main}`, data);
  }

  public readonly update = (data: ProcessUM): Observable<ProcessVM> => {
    return this.httpClient
      .put<ProcessVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.main}`, data);
  }

  public readonly remove = (id: string): Observable<ProcessVM> => {
    return this.httpClient.delete<ProcessVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProcessVM[]> => {
    return this.httpClient
      .put<ProcessVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProcessVM[]> => {
    return this.httpClient.put<ProcessVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['bpmn-api'].process.getById}unique?label=${label}&value=${value}`);
  }
}
