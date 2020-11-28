import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(
    protected readonly loadingService: LoadingService,
    protected readonly tokenService: TokenService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.next(true);
    const token = this.tokenService.getToken();
    request = request.clone(
      {
        reportProgress: true,
        setHeaders: token ? { authorization: `${token}` } : {},
      }
    );
    return next.handle(request).pipe(
      tap(
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {

            }
          }
        }
      ), finalize(() => {
        setTimeout(() => {
          this.loadingService.next(false);
        }, 1000);
      })
    );
  }
}
