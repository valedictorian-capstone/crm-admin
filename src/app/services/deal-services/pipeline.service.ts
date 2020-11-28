import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PipelineVM, PipelineCM, PipelineUM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<PipelineVM[]> => {
    return this.httpClient.get<PipelineVM[]>(`${environment.apiEndpont}${environment.api.deal.pipeline.main}`);
  }

  public readonly findById = (id: string): Observable<PipelineVM> => {
    return this.httpClient.get<PipelineVM>(`${environment.apiEndpont}${environment.api.deal.pipeline.getById}${id}`);
  }

  public readonly save = (data: PipelineUM | PipelineCM): Observable<PipelineVM> => {
    return this.httpClient.put<PipelineVM>(`${environment.apiEndpont}${environment.api.deal.pipeline.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.pipeline.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<PipelineVM> => {
    return this.httpClient.put<PipelineVM>(`${environment.apiEndpont}${environment.api.deal.pipeline.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<PipelineVM> => {
    return this.httpClient.put<PipelineVM>(`${environment.apiEndpont}${environment.api.deal.pipeline.deactive}`, ids);
  }

}
