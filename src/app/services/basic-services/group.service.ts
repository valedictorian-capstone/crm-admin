import { GroupCM, GroupUM, GroupVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<GroupVM[]> => {
    return this.httpClient.get<GroupVM[]>(`${environment.apiEndpont}${environment.api['basic-api'].group.main}`);
  }

  public readonly findById = (id: string): Observable<GroupVM> => {
    return this.httpClient.get<GroupVM>(`${environment.apiEndpont}${environment.api['basic-api'].group.getById}${id}`);
  }

  public readonly insert = (data: GroupCM): Observable<GroupVM> => {
    return this.httpClient.post<GroupVM>(`${environment.apiEndpont}${environment.api['basic-api'].group.main}`, data);
  }

  public readonly update = (data: GroupUM): Observable<GroupVM> => {
    return this.httpClient.put<GroupVM>(`${environment.apiEndpont}${environment.api['basic-api'].group.main}`, data);
  }

  public readonly remove = (id: string): Observable<GroupVM> => {
    return this.httpClient.delete<GroupVM>(`${environment.apiEndpont}${environment.api['basic-api'].group.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<GroupVM> => {
    return this.httpClient.put<GroupVM>(`${environment.apiEndpont}${environment.api['basic-api'].group.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<GroupVM> => {
    return this.httpClient.put<GroupVM>(`${environment.apiEndpont}${environment.api['basic-api'].group.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}${environment.api['basic-api'].group.getById}unique?label=${label}&value=${value}`);
  }
}
