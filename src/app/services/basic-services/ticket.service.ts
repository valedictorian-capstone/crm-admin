import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketCM, TicketUM, TicketVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: TicketVM | TicketVM[]
  }> => {
    return this.socket.fromEvent('tickets');
  }

  public readonly findAll = (): Observable<TicketVM[]> => {
    return this.httpClient.get<TicketVM[]>(`${environment.apiEndpont}${environment.api.basic.ticket.main}`);
  }

  public readonly findById = (id: string): Observable<TicketVM> => {
    return this.httpClient.get<TicketVM>(`${environment.apiEndpont}${environment.api.basic.ticket.getById}${id}`);
  }

  public readonly findByCustomerId = (id: string): Observable<TicketVM[]> => {
    return this.httpClient.get<TicketVM[]>(`${environment.apiEndpont}${environment.api.basic.ticket.getById}customer/${id}`);
  }

  public readonly insert = (data: TicketCM): Observable<TicketVM> => {
    return this.httpClient.post<TicketVM>(`${environment.apiEndpont}${environment.api.basic.ticket.main}`, data);
  }

  public readonly update = (data: TicketUM): Observable<TicketVM> => {
    return this.httpClient.put<TicketVM>(`${environment.apiEndpont}${environment.api.basic.ticket.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.ticket.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<TicketVM> => {
    return this.httpClient.put<TicketVM>(`${environment.apiEndpont}${environment.api.basic.ticket.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<TicketVM> => {
    return this.httpClient.put<TicketVM>(`${environment.apiEndpont}${environment.api.basic.ticket.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.basic.ticket.getById}unique?label=${label}&value=${value}`);
  }
}
