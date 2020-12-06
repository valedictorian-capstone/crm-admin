import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityCM, ActivityUM, ActivityVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }

  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: ActivityVM | ActivityVM[]
  }> => {
    return this.socket.fromEvent('activitys');
  }
  public readonly findAll = (): Observable<ActivityVM[]> => {
    return this.httpClient.get<ActivityVM[]>(`${environment.apiEndpont}${environment.api.deal.activity.main}`);
  }
  public readonly findById = (id: string): Observable<ActivityVM> => {
    return this.httpClient.get<ActivityVM>(`${environment.apiEndpont}${environment.api.deal.activity.getById}${id}`);
  }
  public readonly insert = (data: ActivityCM): Observable<ActivityVM> => {
    return this.httpClient.post<ActivityVM>(`${environment.apiEndpont}${environment.api.deal.activity.main}`, data);
  }
  public readonly update = (data: ActivityUM): Observable<ActivityVM> => {
    return this.httpClient.put<ActivityVM>(`${environment.apiEndpont}${environment.api.deal.activity.main}`, data);
  }
  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.activity.getById}${id}`);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.activity.getById}unique?label=${label}&value=${value}`);
  }
}
