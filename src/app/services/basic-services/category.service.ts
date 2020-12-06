import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CategoryVM, CategoryCM, CategoryUM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }

  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: CategoryVM | CategoryVM[]
  }> => {
    return this.socket.fromEvent('categorys');
  }

  public readonly findAll = (): Observable<CategoryVM[]> => {
    return this.httpClient.get<CategoryVM[]>(`${environment.apiEndpont}${environment.api.basic.category.main}`);
  }

  public readonly findById = (id: string): Observable<CategoryVM> => {
    return this.httpClient.get<CategoryVM>(`${environment.apiEndpont}${environment.api.basic.category.getById}${id}`);
  }

  public readonly insert = (data: CategoryCM): Observable<CategoryVM> => {
    return this.httpClient.put<CategoryVM>(`${environment.apiEndpont}${environment.api.basic.category.main}`, data);
  }

  public readonly update = (data: CategoryUM): Observable<CategoryVM> => {
    return this.httpClient.put<CategoryVM>(`${environment.apiEndpont}${environment.api.basic.category.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.category.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<CategoryVM> => {
    return this.httpClient.put<CategoryVM>(`${environment.apiEndpont}${environment.api.basic.category.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<CategoryVM> => {
    return this.httpClient.put<CategoryVM>(`${environment.apiEndpont}${environment.api.basic.category.deactive}`, ids);
  }

}
