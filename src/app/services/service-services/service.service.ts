import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ServiceCM, ServiceUM, ServiceVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ServiceVM[]> => {
    return this.httpClient.get<ServiceVM[]>(`${environment.apiEndpont}${environment.api['service-api'].service.main}`);
  }

  public readonly findById = (id: string): Observable<ServiceVM> => {
    return this.httpClient.get<ServiceVM>(`${environment.apiEndpont}${environment.api['service-api'].service.getById}${id}`);
  }

  public readonly insert = (data: ServiceCM): Observable<ServiceVM> => {
    return this.httpClient.post<ServiceVM>(`${environment.apiEndpont}${environment.api['service-api'].service.main}`, data);
  }

  public readonly update = (data: ServiceUM): Observable<ServiceVM> => {
    return this.httpClient.put<ServiceVM>(`${environment.apiEndpont}${environment.api['service-api'].service.main}`, data);
  }

  public readonly remove = (id: string): Observable<ServiceVM> => {
    return this.httpClient.delete<ServiceVM>(`${environment.apiEndpont}${environment.api['service-api'].service.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ServiceVM> => {
    return this.httpClient.put<ServiceVM>(`${environment.apiEndpont}${environment.api['service-api'].service.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ServiceVM> => {
    return this.httpClient.put<ServiceVM>(`${environment.apiEndpont}${environment.api['service-api'].service.deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['service-api'].service.getById}unique?label=${label}&value=${value}`);
  }
}
