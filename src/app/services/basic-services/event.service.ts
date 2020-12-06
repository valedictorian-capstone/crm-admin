import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { EventVM, EventCM, EventUM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: EventVM | EventVM[]
  }> => {
    return this.socket.fromEvent('events');
  }

  public readonly findAll = (): Observable<EventVM[]> => {
    return this.httpClient.get<EventVM[]>(`${environment.apiEndpont}${environment.api.basic.event.main}`);
  }

  public readonly findById = (id: string): Observable<EventVM> => {
    return this.httpClient.get<EventVM>(`${environment.apiEndpont}${environment.api.basic.event.getById}${id}`);
  }

  public readonly save = (data: EventUM): Observable<EventVM> => {
    return this.httpClient.put<EventVM>(`${environment.apiEndpont}${environment.api.basic.event.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.event.getById}${id}`);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.basic.event.getById}unique?label=${label}&value=${value}`);
  }
}
