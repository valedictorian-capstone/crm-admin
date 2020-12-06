import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PipelineVM, PipelineCM, PipelineUM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: PipelineVM | PipelineVM[]
  }> => {
    return this.socket.fromEvent('pipelines');
  }

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

  public readonly restore = (id: string): Observable<PipelineVM> => {
    return this.httpClient.put<PipelineVM>(`${environment.apiEndpont}${environment.api.deal.pipeline.restore}/${id}`, {});
  }

}
