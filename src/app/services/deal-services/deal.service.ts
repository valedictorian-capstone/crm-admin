import { DealCM, DealUM, DealVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: DealVM}>();
  constructor(protected readonly httpClient: HttpClient) { }
  public readonly findAll = (): Observable<DealVM[]> => {
    return this.httpClient.get<DealVM[]>(`${environment.apiEndpont}${environment.api.deal.deal.main}`);
  }
  public readonly findById = (id: string): Observable<DealVM> => {
    return this.httpClient.get<DealVM>(`${environment.apiEndpont}${environment.api.deal.deal.getById}${id}`);
  }
  public readonly findByStage = (id: string): Observable<DealVM[]> => {
    return this.httpClient.get<DealVM[]>(`${environment.apiEndpont}${environment.api.deal.deal.getById}stage/${id}`);
  }
  public readonly insert = (data: DealCM): Observable<DealVM> => {
    return this.httpClient.post<DealVM>(`${environment.apiEndpont}${environment.api.deal.deal.main}`, data);
  }
  public readonly update = (data: DealUM): Observable<DealVM> => {
    return this.httpClient.put<DealVM>(`${environment.apiEndpont}${environment.api.deal.deal.main}`, data);
  }
  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.deal.getById}${id}`);
  }
  public readonly active = (ids: string[]): Observable<DealVM> => {
    return this.httpClient.put<DealVM>(`${environment.apiEndpont}${environment.api.deal.deal.active}`, ids);
  }
  public readonly deactive = (ids: string[]): Observable<DealVM> => {
    return this.httpClient.put<DealVM>(`${environment.apiEndpont}${environment.api.deal.deal.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.deal.getById}unique?label=${label}&value=${value}`);
  }
}
