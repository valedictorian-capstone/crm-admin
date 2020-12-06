import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DeviceVM, DeviceCM, DeviceUM } from '@view-models';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly socket: Socket,
  ) { }
  public readonly triggerSocket = (): Observable<{
    type: 'update' | 'create' | 'remove' | 'view' | 'list',
    data: DeviceVM | DeviceVM[]
  }> => {
    return this.socket.fromEvent('devices');
  }

  public readonly findAll = (): Observable<DeviceVM[]> => {
    return this.httpClient.get<DeviceVM[]>(`${environment.apiEndpont}${environment.api.basic.device.main}`);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.basic.device.getById}${id}`);
  }

}
