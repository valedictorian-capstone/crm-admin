import { ActivityCM, ActivityUM, ActivityVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: ActivityVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

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

  public readonly active = (ids: string[]): Observable<ActivityVM> => {
    return this.httpClient.put<ActivityVM>(`${environment.apiEndpont}${environment.api.deal.activity.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ActivityVM> => {
    return this.httpClient.put<ActivityVM>(`${environment.apiEndpont}${environment.api.deal.activity.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.activity.getById}unique?label=${label}&value=${value}`);
  }
}
