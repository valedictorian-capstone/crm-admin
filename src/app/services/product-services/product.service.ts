import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ProductCM, ProductUM, ProductVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProductVM[]> => {
    return this.httpClient.get<ProductVM[]>(`${environment.apiEndpont}${environment.api['product-api'].product.main}`);
  }

  public readonly findById = (id: string): Observable<ProductVM> => {
    return this.httpClient.get<ProductVM>(`${environment.apiEndpont}${environment.api['product-api'].product.getById}${id}`);
  }

  public readonly insert = (data: ProductCM): Observable<ProductVM> => {
    return this.httpClient.post<ProductVM>(`${environment.apiEndpont}${environment.api['product-api'].product.main}`, data);
  }

  public readonly update = (data: ProductUM): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api['product-api'].product.main}`, data);
  }

  public readonly remove = (id: string): Observable<ProductVM> => {
    return this.httpClient.delete<ProductVM>(`${environment.apiEndpont}${environment.api['product-api'].product.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api['product-api'].product.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api['product-api'].product.deactive}`, ids);
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['product-api'].product.getById}unique?label=${label}&value=${value}`);
  }
}
