import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response';
import { RESTAPI_ROOT_URL } from './rest-api-config';

@Injectable({
  providedIn: 'root',
})
export class ViewsetRestApiService {
  constructor(private http: HttpClient) {}

  list<T>(
    view: string,
    page: number = 1,
    per_page: number = 16
  ): Observable<PaginatedResponse<T>> {
    let url = `${RESTAPI_ROOT_URL}/${view}/`;
    console.log(`ViewsetRestApiService.list : ${url}`);
    return this.http.get<PaginatedResponse<T>>(url);
  }

  get<T>(view: string, pk: any): Observable<T> {
    let url = `${RESTAPI_ROOT_URL}/${view}/${pk}/`;
    console.log(`ViewsetRestApiService.get : ${url}`);
    return this.http.get<T>(url);
  }
}
