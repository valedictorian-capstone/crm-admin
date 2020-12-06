import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CustomerVM, DealVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(protected readonly httpClient: HttpClient) { }
  public readonly findCustomerInMonth = (month: number, year: number): Observable<{ id: string, name: string, data: CustomerVM[] }[]> => {
    return this.httpClient.get<{ id: string, name: string, data: CustomerVM[] }[]>(`${environment.apiEndpont}${environment.api.extra.statistic.customerInMonth}?year=${year}&month=${month}`);
  }
  public readonly findDealInMonth = (month: number, year: number): Observable<{ status: string, data: DealVM[] }[]> => {
    return this.httpClient.get<{ status: string, data: DealVM[] }[]>(`${environment.apiEndpont}${environment.api.extra.statistic.dealInMonth}?year=${year}&month=${month}`);
  }
  public readonly findCustomerInYear = (year: number): Observable<{ id: string, name: string, data: Array<CustomerVM[]> }[]> => {
    return this.httpClient.get<{ id: string, name: string, data: Array<CustomerVM[]> }[]>(`${environment.apiEndpont}${environment.api.extra.statistic.customerInYear}?year=${year}`);
  }
  public readonly findDealInYear = (year: number): Observable<{ status: string, data: Array<DealVM[]> }[]> => {
    return this.httpClient.get<{ status: string, data: Array<DealVM[]> }[]>(`${environment.apiEndpont}${environment.api.extra.statistic.dealInYear}?year=${year}`);
  }
}
