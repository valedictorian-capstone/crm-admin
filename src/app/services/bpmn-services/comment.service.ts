import { CommentCM, CommentUM, CommentVM } from '@view-models';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<CommentVM[]> => {
    return this.httpClient.get<CommentVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.main}`);
  }

  public readonly findById = (id: string): Observable<CommentVM> => {
    return this.httpClient.get<CommentVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.getById}${id}`);
  }

  public readonly insert = (data: CommentCM): Observable<CommentVM> => {
    return this.httpClient.post<CommentVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.main}`, data);
  }

  public readonly update = (data: CommentUM): Observable<CommentVM> => {
    return this.httpClient.put<CommentVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.main}`, data);
  }

  public readonly remove = (id: string): Observable<CommentVM> => {
    return this.httpClient.delete<CommentVM>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.getById}${id}`);
  }

  public readonly active = (ids: string[]): Observable<CommentVM[]> => {
    return this.httpClient.put<CommentVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.active}`, ids);
  }

  public readonly deactive = (ids: string[]): Observable<CommentVM[]> => {
    return this.httpClient.put<CommentVM[]>(`${environment.apiEndpont}${environment.api['bpmn-api'].comment.deactive}`, ids);
  }
}
