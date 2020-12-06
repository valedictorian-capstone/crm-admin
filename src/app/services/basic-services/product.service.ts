import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ProductCM, ProductUM, ProductVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: ProductVM | ProductVM[]
  }> => {
    return this.socket.fromEvent('products');
  }

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

  public readonly restore = (id: string): Observable<ProductVM> => {
    return this.httpClient.put<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.restore}/${id}`, {});
  }

  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api.basic.product.getById}unique?label=${label}&value=${value}`);
  }
}
