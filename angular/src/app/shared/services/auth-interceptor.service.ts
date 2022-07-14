import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private auth: AuthService, private http: HttpClient) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('AuthInterceptorService.intercept');
    console.log(`${this.auth.accessToken}`);
    if (!this.auth.accessToken) {
      return next.handle(req);
    }
    let authReq = req.clone();
    authReq = this.addTokenHeader(authReq);
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>) {
    if (this.auth.accessToken)
      return request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this.auth.accessToken
        ),
      });
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshToken = this.auth.refreshToken;

      if (refreshToken) {
        let refreshReq = this.auth.refresh();
        return refreshReq.pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            console.log(token);
            let data = JSON.parse(atob(token.body.access.split('.')[1]));

            this.auth.accessToken = token.body.access;
            this.auth.refreshToken = token.body.refresh;

            this.refreshTokenSubject.next(token.access);
            return next.handle(this.addTokenHeader(request));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.auth.logout();
            //this.router.navigate(['login']);
            return throwError(() => err);
          })
        );
      } else {
        //this.router.navigate(['login']);
      }
    }
    return this.refreshTokenSubject.pipe(
      switchMap((token) => {
        return next.handle(this.addTokenHeader(request));
      })
    );
  }
}
