import { NotificationVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<NotificationVM[]> => {
    return this.httpClient.get<NotificationVM[]>(`${environment.apiEndpont}${environment.api.basic.notification.main}`);
  }

  public readonly seen = (data: NotificationVM): Observable<NotificationVM[]> => {
    return this.httpClient.put<NotificationVM[]>(`${environment.apiEndpont}${environment.api.basic.notification.seen}/${data.id}`, data);
  }
  public readonly seenAll = (ids: string[]): Observable<NotificationVM[]> => {
    return this.httpClient.put<NotificationVM[]>(`${environment.apiEndpont}${environment.api.basic.notification.seen}`, ids);
  }
}
