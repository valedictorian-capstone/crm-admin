import { NotificationVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: NotificationVM | NotificationVM[]
  }> => {
    return this.socket.fromEvent('notifications');
  }
  public readonly findAll = (): Observable<NotificationVM[]> => {
    return this.httpClient.get<NotificationVM[]>(`${environment.apiEndpont}${environment.api.basic.notification.main}`);
  }
  public readonly seen = (id: string): Observable<NotificationVM[]> => {
    return this.httpClient.put<NotificationVM[]>(`${environment.apiEndpont}${environment.api.basic.notification.seen}/${id}`, {});
  }
  public readonly seenAll = (ids: NotificationVM[]): Observable<NotificationVM[]> => {
    return this.httpClient.put<NotificationVM[]>(`${environment.apiEndpont}${environment.api.basic.notification.seen}`, ids);
  }
}
