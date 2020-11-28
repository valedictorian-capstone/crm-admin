import { StageCM, StageUM, StageVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<StageVM[]> => {
    return this.httpClient.get<StageVM[]>(`${environment.apiEndpont}${environment.api.deal.stage.main}`);
  }

  public readonly findById = (id: string): Observable<StageVM> => {
    return this.httpClient.get<StageVM>(`${environment.apiEndpont}${environment.api.deal.stage.getById}${id}`);
  }

  public readonly insert = (data: StageCM): Observable<StageVM> => {
    return this.httpClient.post<StageVM>(`${environment.apiEndpont}${environment.api.deal.stage.main}`, data);
  }

  public readonly update = (data: StageUM): Observable<StageVM> => {
    return this.httpClient.put<StageVM>(`${environment.apiEndpont}${environment.api.deal.stage.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.stage.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<StageVM> => {
    return this.httpClient.put<StageVM>(`${environment.apiEndpont}${environment.api.deal.stage.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<StageVM> => {
    return this.httpClient.put<StageVM>(`${environment.apiEndpont}${environment.api.deal.stage.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.stage.getById}unique?label=${label}&value=${value}`);
  }
}
