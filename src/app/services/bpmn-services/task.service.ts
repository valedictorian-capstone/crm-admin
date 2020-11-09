import { TaskCM, TaskUM, TaskVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<TaskVM[]> => {
    return this.httpClient.get<TaskVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.main}`);
  }

  public readonly findById = (id: string): Observable<TaskVM> => {
    return this.httpClient.get<TaskVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.getById}${id}`);
  }

  public readonly insert = (data: TaskCM): Observable<TaskVM> => {
    return this.httpClient.post<TaskVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.main}`, data);
  }

  public readonly update = (data: TaskUM): Observable<TaskVM> => {
    return this.httpClient.put<TaskVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.main}`, data);
  }

  public readonly remove = (id: string): Observable<TaskVM> => {
    return this.httpClient.delete<TaskVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<TaskVM[]> => {
    return this.httpClient.put<TaskVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<TaskVM[]> => {
    return this.httpClient.put<TaskVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].task.deactive}`, ids);
  }
}
