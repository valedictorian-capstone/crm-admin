import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CustomerCM, CustomerUM, CustomerVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<CustomerVM[]> => {
    return this.httpClient.get<CustomerVM[]>(`${environment.apiEndpont}${environment.api['customer-api'].customer.main}`);
  }

  public readonly findById = (id: string): Observable<CustomerVM> => {
    return this.httpClient.get<CustomerVM>(`${environment.apiEndpont}${environment.api['customer-api'].customer.getById}${id}`);
  }

  public readonly insert = (data: CustomerCM): Observable<CustomerVM> => {
    return this.httpClient.post<CustomerVM>(`${environment.apiEndpont}${environment.api['customer-api'].customer.main}`, data);
  }

  public readonly update = (data: CustomerUM): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api['customer-api'].customer.main}`, data);
  }

  public readonly remove = (id: string): Observable<CustomerVM> => {
    return this.httpClient.delete<CustomerVM>(`${environment.apiEndpont}${environment.api['customer-api'].customer.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api['customer-api'].customer.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api['customer-api'].customer.deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['customer-api'].customer.getById}unique?label=${label}&value=${value}`);
  }
}
