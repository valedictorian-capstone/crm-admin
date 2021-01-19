import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttachmentUM, AttachmentVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }

  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: AttachmentVM | AttachmentVM[]
  }> => {
    return this.socket.fromEvent('attachments');
  }
  public readonly findAll = (): Observable<AttachmentVM[]> => {
    return this.httpClient.get<AttachmentVM[]>(`${environment.apiEndpont}${environment.api.deal.attachment.main}`);
  }

  public readonly findById = (id: string): Observable<AttachmentVM> => {
    return this.httpClient.get<AttachmentVM>(`${environment.apiEndpont}${environment.api.deal.attachment.getById}${id}`);
  }
  public readonly findByCampaignId = (id: string): Observable<AttachmentVM[]> => {
    return this.httpClient.get<AttachmentVM[]>(`${environment.apiEndpont}${environment.api.deal.attachment.getById}${id}/campaign`);
  }
  public readonly query = (params: {key: string, id: string}): Observable<AttachmentVM[]> => {
    return this.httpClient.get<AttachmentVM[]>(`${environment.apiEndpont}${environment.api.deal.attachment.main}/query`, {
      params
    });
  }
  public readonly removeMany = (body: AttachmentVM[]): Observable<AttachmentVM[]> => {
    return this.httpClient.put<AttachmentVM[]>(`${environment.apiEndpont}${environment.api.deal.attachment.main}/many`, body);
  }
  public readonly insert = (data: FormData): Observable<AttachmentVM[]> => {
    return this.httpClient.post<AttachmentVM[]>(`${environment.apiEndpont}${environment.api.deal.attachment.main}`, data);
  }

  public readonly update = (data: AttachmentUM): Observable<AttachmentVM> => {
    return this.httpClient.put<AttachmentVM>(`${environment.apiEndpont}${environment.api.deal.attachment.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.attachment.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<AttachmentVM> => {
    return this.httpClient.put<AttachmentVM>(`${environment.apiEndpont}${environment.api.deal.attachment.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<AttachmentVM> => {
    return this.httpClient.put<AttachmentVM>(`${environment.apiEndpont}${environment.api.deal.attachment.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.attachment.getById}unique?label=${label}&value=${value}`);
  }
}
