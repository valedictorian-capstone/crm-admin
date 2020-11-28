import { NoteCM, NoteUM, NoteVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  public readonly triggerValue$ = new Subject<{type: 'create' | 'update' | 'remove', data: NoteVM}>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<NoteVM[]> => {
    return this.httpClient.get<NoteVM[]>(`${environment.apiEndpont}${environment.api.deal.note.main}`);
  }

  public readonly findById = (id: string): Observable<NoteVM> => {
    return this.httpClient.get<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.getById}${id}`);
  }

  public readonly insert = (data: NoteCM): Observable<NoteVM> => {
    return this.httpClient.post<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.main}`, data);
  }

  public readonly update = (data: NoteUM): Observable<NoteVM> => {
    return this.httpClient.put<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.main}`, data);
  }

  public readonly remove = (id: string): Observable<string> => {
    return this.httpClient.delete<string>(`${environment.apiEndpont}${environment.api.deal.note.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<NoteVM> => {
    return this.httpClient.put<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<NoteVM> => {
    return this.httpClient.put<NoteVM>(`${environment.apiEndpont}${environment.api.deal.note.deactive}`, ids);
  }
  public readonly checkUnique = (label: string, value: string): Observable<boolean> => {
    return this.httpClient.get<boolean>(`${environment.apiEndpont}
    ${environment.api.deal.note.getById}unique?label=${label}&value=${value}`);
  }
}
