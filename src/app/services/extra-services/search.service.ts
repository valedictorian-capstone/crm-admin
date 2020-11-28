import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SearchVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(protected readonly httpClient: HttpClient) { }
  public readonly search = (value: string): Observable<SearchVM[]> => {
    return this.httpClient.get<SearchVM[]>(`${environment.apiEndpont}${environment.api.extra.search.main}`, {
      params: {
        value
      }
    });
  }
}
