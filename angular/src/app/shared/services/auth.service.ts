import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { RESTAPI_ROOT_URL } from './rest-api-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _user?: User;

  constructor(private http: HttpClient) {
    let storedAccess = localStorage.getItem('accessToken');
    let storedRefresh = localStorage.getItem('refreshToken');
    let storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._user = JSON.parse(storedUser);
    }
    if (storedAccess) {
      this.accessToken = storedAccess;
    }
    if (storedRefresh) {
      this.refreshToken = storedRefresh;
    }
  }

  public get user() {
    let storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return undefined;
  }

  public get accessToken() {
    return localStorage.getItem('accessToken');
  }

  public get refreshToken() {
    return localStorage.getItem('accessToken');
  }

  public set accessToken(value: string | null) {
    localStorage.setItem('accessToken', value ? value : '');
  }

  public set refreshToken(value: string | null) {
    localStorage.setItem('refreshToken', value ? value : '');
  }

  public logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this._user = undefined;
    localStorage.removeItem('user');
  }

  public login(
    username: string,
    password: string,
    onSuccess: () => void,
    onError: (err: HttpErrorResponse) => void
  ) {
    this.accessToken = null;
    this.refreshToken = null;

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    let loginUrl = `${RESTAPI_ROOT_URL}/token/`;
    let loginReq = this.http.post<any>(loginUrl, formData, {
      observe: 'response',
    });
    loginReq.subscribe({
      next: (response) => {
        if (response.ok) {
          this.accessToken = response.body.access;
          this.refreshToken = response.body.refresh;
          let data = JSON.parse(atob(response.body.access.split('.')[1]));
          this.getUserInfo(Number(data.user_id));
          onSuccess();
        }
      },
      error: (error) => {
        onError(error);
      },
    });
  }

  public register(
    username: string,
    email: string,
    password: string,
    onSuccess: () => void,
    onError: (err: HttpErrorResponse) => void
  ) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    let registerUrl = `${RESTAPI_ROOT_URL}/user/register/`;
    let registerReq = this.http.post<any>(registerUrl, formData, {
      observe: 'response',
    });
    registerReq.subscribe({
      next: (response) => {
        if (response.ok) {
          this.login(
            username,
            password,
            () => {
              onSuccess();
            },
            (err) => {
              onError(err);
            }
          );
        }
      },
      error: (error) => {
        onError(error);
      },
    });
  }

  public getUserInfo(userId: number) {
    let url = `${RESTAPI_ROOT_URL}/user/${userId}/`;
    let loginReq = this.http.get<User>(url);

    loginReq.subscribe((user) => {
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      this._user = user;
    });
  }

  public refresh() {
    const formData = new FormData();
    formData.append('refresh', this.refreshToken ? this.refreshToken : '');
    let refreshUrl = `${RESTAPI_ROOT_URL}/token/refresh`;
    return this.http.post(refreshUrl, formData, {
      observe: 'response',
    });
  }
}
