import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { CampaignGroupVM } from '@view-models';
import { environment } from '@environments/environment';
import { NoteCM, NoteUM } from '@view-models';

@Injectable({
  providedIn: 'root'
})
export class CampaignGroupService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: CampaignGroupVM | CampaignGroupVM[]
  }> => {
    return this.socket.fromEvent('campaignGroups');
  }

  public readonly findAll = (): Observable<CampaignGroupVM[]> => {
    return this.httpClient.get<CampaignGroupVM[]>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.main}`);
  }

  public readonly findById = (id: string): Observable<CampaignGroupVM> => {
    return this.httpClient.get<CampaignGroupVM>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.getById}${id}`);
  }
  public readonly findByCampaignId = (id: string): Observable<CampaignGroupVM[]> => {
    return this.httpClient.get<CampaignGroupVM[]>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.getById}${id}/campaign`);
  }
  public readonly removeMany = (body: CampaignGroupVM[]): Observable<CampaignGroupVM[]> => {
    return this.httpClient.put<CampaignGroupVM[]>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.main}/many`, body);
  }
  public readonly query = (params: {key: string, id: string}): Observable<CampaignGroupVM[]> => {
    return this.httpClient.get<CampaignGroupVM[]>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.main}/query`, {
      params
    });
  }
  public readonly insert = (data: NoteCM): Observable<CampaignGroupVM> => {
    return this.httpClient.post<CampaignGroupVM>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.main}`, data);
  }

  public readonly update = (data: NoteUM): Observable<CampaignGroupVM> => {
    return this.httpClient.put<CampaignGroupVM>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.campaignGroup.getById}${id}`);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.campaignGroup.getById}unique?label=${label}&value=${value}`);
  }
}
