import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { LogVM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: LogVM | LogVM[]
  }> => {
    return this.socket.fromEvent('logs');
  }

  public readonly findAll = (): Observable<LogVM[]> => {
    return this.httpClient.get<LogVM[]>(`${environment.apiEndpont}${environment.api.deal.log.main}`);
  }
}
