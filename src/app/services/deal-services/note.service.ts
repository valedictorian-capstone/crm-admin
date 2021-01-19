import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NoteCM, NoteUM, NoteVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: NoteVM | NoteVM[]
  }> => {
    return this.socket.fromEvent('notes');
  }

  public readonly findAll = (): Observable<NoteVM[]> => {
    return this.httpClient.get<NoteVM[]>(`${environment.apiEndpont}${environment.api.deal.note.main}`);
  }

  public readonly findById = (id: string): Observable<NoteVM> => {
    return this.httpClient.get<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.getById}${id}`);
  }
  public readonly findByCampaignId = (id: string): Observable<NoteVM[]> => {
    return this.httpClient.get<NoteVM[]>(`${environment.apiEndpont}${environment.api.deal.note.getById}${id}/campaign`);
  }
  public readonly removeMany = (body: NoteVM[]): Observable<NoteVM[]> => {
    return this.httpClient.put<NoteVM[]>(`${environment.apiEndpont}${environment.api.deal.note.main}/many`, body);
  }
  public readonly query = (params: {key: string, id: string}): Observable<NoteVM[]> => {
    return this.httpClient.get<NoteVM[]>(`${environment.apiEndpont}${environment.api.deal.note.main}/query`, {
      params
    });
  }
  public readonly insert = (data: NoteCM): Observable<NoteVM> => {
    return this.httpClient.post<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.main}`, data);
  }

  public readonly update = (data: NoteUM): Observable<NoteVM> => {
    return this.httpClient.put<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.note.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<NoteVM> => {
    return this.httpClient.put<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<NoteVM> => {
    return this.httpClient.put<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.note.getById}unique?label=${label}&value=${value}`);
  }
}
