import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(
    protected readonly httpClient: HttpClient,
  ) { }

  public readonly create = (name: string, token: string): Observable<any> => {
    return this.httpClient.post<any>(`${environment.stringee.endpoint}/create`, {
      name,
      uniqueName: name
    },
      {
        headers: {
          'X-STRINGEE-AUTH': token
        },
      },
    );
  }

  public readonly remove = (id: string, token: string): Observable<any> => {
    return this.httpClient.put<any>(`${environment.stringee.endpoint}/delete`, {
      roomId: id,
    },
      {
        headers: {
          'X-STRINGEE-AUTH': token
        },
      },
    );
  }

  private readonly getToken = (data: { userId?: string, roomId?: string, rest?: boolean }): Observable<any> => {
    return this.httpClient.get<any>(`${environment.stringee.api}`, {
      params: {
        keySid: environment.stringee.sid,
        keySecret: environment.stringee.serect,
        userId: data.userId,
        roomId: data.roomId,
        rest: data.rest + ''
      }
    });
  }

  public readonly getAccessToken = (userId: string): Observable<any> => {
    return this.getToken({ userId });
  }

  public readonly getRoomToken = (roomId: string): Observable<any> => {
    return this.getToken({ roomId });
  }

  public readonly getRestToken = (rest: boolean): Observable<any> => {
    return this.getToken({ rest });
  }

  public readonly listRoom = (token: string): Observable<any> => {
    return this.httpClient.get<any>(`${environment.stringee.endpoint}/list`, {
      headers: {
        'X-STRINGEE-AUTH': token
      },
    });
  }

}
