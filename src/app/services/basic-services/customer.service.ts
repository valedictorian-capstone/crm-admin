import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CustomerCM, CustomerUM, CustomerVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: CustomerVM | CustomerVM[]
  }> => {
    return this.socket.fromEvent('customers');
  }
  public readonly findAll = (): Observable<CustomerVM[]> => {
    return this.httpClient.get<CustomerVM[]>(`${environment.apiEndpont}${environment.api.basic.customer.main}`);
  }
  public readonly query = (params: {id: string}): Observable<CustomerVM[]> => {
    return this.httpClient.get<CustomerVM[]>(`${environment.apiEndpont}${environment.api.basic.customer.main}/query`, {
      params
    });
  }
  public readonly findAllLead = (): Observable<CustomerVM[]> => {
    return this.httpClient.get<CustomerVM[]>(`${environment.apiEndpont}${environment.api.basic.customer.main}/lead`);
  }
  public readonly findById = (id: string): Observable<CustomerVM> => {
    return this.httpClient.get<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.getById}${id}`);
  }

  public readonly import = (data: CustomerCM[]): Observable<CustomerVM[]> => {
    return this.httpClient.post<CustomerVM[]>(`${environment.apiEndpont}${environment.api.basic.customer.main}/import`, data);
  }

  public readonly insert = (data: CustomerCM): Observable<CustomerVM> => {
    return this.httpClient.post<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.main}`, data);
  }

  public readonly update = (data: CustomerUM): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.main}`, data);
  }

  public readonly disabled = (id: string): Observable<CustomerVM> => {
    return this.httpClient.delete<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.getById}${id}`);
  }

  public readonly restore = (id: string): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.restore}/${id}`, {});
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api.basic.customer.getById}unique?label=${label}&value=${value}`);
  }
}
