import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DealDetailCM, DealDetailUM, DealDetailVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DealDetailService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: DealDetailVM | DealDetailVM[]
  }> => {
    return this.socket.fromEvent('dealDetails');
  }
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
