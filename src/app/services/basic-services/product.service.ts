import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ProductCM, ProductUM, ProductVM } from '@view-models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: ProductVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProductVM[]> => {
    return this.httpClient.get<ProductVM[]>(`${environment.apiEndpont}${environment.api.basic.product.main}`);
  }

  public readonly findById = (id: string): Observable<ProductVM> => {
    return this.httpClient.get<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.getById}${id}`);
  }

  public readonly insert = (data: ProductCM): Observable<ProductVM> => {
    return this.httpClient.post<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.main}`, data);
  }
  public readonly import = (data: ProductCM[]): Observable<ProductVM[]> => {
    return this.httpClient.post<ProductVM[]>(`${environment.apiEndpont}${environment.api.basic.product.main}/import`, data);
  }
  public readonly update = (data: ProductUM): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.product.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api.basic.product.getById}unique?label=${label}&value=${value}`);
  }
}
