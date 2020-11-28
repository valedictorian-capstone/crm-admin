import { TicketCM, TicketUM, TicketVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  public readonly triggerValue$ = new Subject<TicketVM>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<TicketVM[]> => {
    return this.httpClient.get<TicketVM[]>(`${environment.apiEndpont}${environment.api.basic.ticket.main}`);
  }

  public readonly findById = (id: string): Observable<TicketVM> => {
    return this.httpClient.get<TicketVM>(`${environment.apiEndpont}${environment.api.basic.ticket.getById}${id}`);
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
