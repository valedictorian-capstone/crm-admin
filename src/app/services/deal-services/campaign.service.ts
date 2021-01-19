import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CampaignCM, CampaignUM, CampaignVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }

  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: CampaignVM | CampaignVM[]
  }> => {
    return this.socket.fromEvent('campaigns');
  }
  public readonly findAll = (): Observable<CampaignVM[]> => {
    return this.httpClient.get<CampaignVM[]>(`${environment.apiEndpont}${environment.api.deal.campaign.main}`);
  }
  public readonly findById = (id: string): Observable<CampaignVM> => {
    return this.httpClient.get<CampaignVM>(`${environment.apiEndpont}${environment.api.deal.campaign.getById}${id}`);
  }
  public readonly query = (params: {key: string, id: string}): Observable<CampaignVM[]> => {
    return this.httpClient.get<CampaignVM[]>(`${environment.apiEndpont}${environment.api.deal.campaign.main}/query`, {
      params
    });
  }
  public readonly removeMany = (body: CampaignVM[]): Observable<CampaignVM[]> => {
    return this.httpClient.put<CampaignVM[]>(`${environment.apiEndpont}${environment.api.deal.campaign.main}/many`, body);
  }
  public readonly insert = (data: CampaignCM): Observable<CampaignVM> => {
    return this.httpClient.post<CampaignVM>(`${environment.apiEndpont}${environment.api.deal.campaign.main}`, data);
  }
  public readonly update = (data: CampaignUM): Observable<CampaignVM> => {
    return this.httpClient.put<CampaignVM>(`${environment.apiEndpont}${environment.api.deal.campaign.main}`, data);
  }
  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.campaign.getById}${id}`);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.campaign.getById}unique?label=${label}&value=${value}`);
  }
}
