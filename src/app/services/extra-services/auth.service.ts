import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenVM, AccountVM, LoginGM, DeviceVM } from '@view-models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly triggerValue$ = new Subject<AccountVM>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly login = (data: LoginGM): Observable<TokenVM> => {
    return this.httpClient.post<TokenVM>(`${environment.apiEndpont}${environment.api.extra.auth.login}`, data);
  }
  public readonly auth = (data: DeviceVM): Observable<AccountVM> => {
    return this.httpClient.put<AccountVM>(`${environment.apiEndpont}${environment.api.extra.auth.main}`, data);
  }
  public readonly updatePassword = (data: { password: string, old: string }): Observable<AccountVM> => {
    return this.httpClient.put<AccountVM>(`${environment.apiEndpont}${environment.api.extra.auth.main}/password`, data);
  }
  public readonly updateProfile = (data: AccountVM): Observable<AccountVM> => {
    return this.httpClient.put<AccountVM>(`${environment.apiEndpont}${environment.api.extra.auth.main}/profile`, data);
  }
}
