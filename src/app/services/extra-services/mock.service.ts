import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Province } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly getProvinces = (): Observable<Province[]> => {
    return this.httpClient.get<Province[]>('../../../assets/all.json');
  }
}
