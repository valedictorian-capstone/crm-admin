import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CustomerCM, CustomerUM, CustomerVM } from '@view-models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public readonly triggerValue$ = new Subject<{ type: 'create' | 'update' | 'delete', data: CustomerVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<CustomerVM[]> => {
    return this.httpClient.get<CustomerVM[]>(`${environment.apiEndpont}${environment.api.basic.customer.main}`);
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

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.customer.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.basic.customer.deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api.basic.customer.getById}unique?label=${label}&value=${value}`);
  }
}
