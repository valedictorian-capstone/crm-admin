import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CustomerVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly sendMail = (data: { info: CustomerVM, subject: string, content: string }): Observable<any> => {
    return this.httpClient.post<any>(`${environment.apiEndpont}${environment.api.extra.email.main}/sendManual`, data);
  }
}
