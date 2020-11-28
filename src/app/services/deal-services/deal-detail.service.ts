import { DealDetailCM, DealDetailUM, DealDetailVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealDetailService {
  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: DealDetailVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<DealDetailVM[]> => {
    return this.httpClient.get<DealDetailVM[]>(`${environment.apiEndpont}${environment.api.deal.dealDetail.main}`);
  }

  public readonly findById = (id: string): Observable<DealDetailVM> => {
    return this.httpClient.get<DealDetailVM>(`${environment.apiEndpont}${environment.api.deal.dealDetail.getById}${id}`);
  }

  public readonly insert = (data: DealDetailCM): Observable<DealDetailVM> => {
    return this.httpClient.post<DealDetailVM>(`${environment.apiEndpont}${environment.api.deal.dealDetail.main}`, data);
  }

  public readonly update = (data: DealDetailUM): Observable<DealDetailVM> => {
    return this.httpClient.put<DealDetailVM>(`${environment.apiEndpont}${environment.api.deal.dealDetail.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.dealDetail.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<DealDetailVM> => {
    return this.httpClient.put<DealDetailVM>(`${environment.apiEndpont}${environment.api.deal.dealDetail.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<DealDetailVM> => {
    return this.httpClient.put<DealDetailVM>(`${environment.apiEndpont}${environment.api.deal.dealDetail.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.dealDetail.getById}unique?label=${label}&value=${value}`);
  }
}
