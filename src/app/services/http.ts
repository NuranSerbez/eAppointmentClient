import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/result.model';
import { api } from '../constants';
import { Error } from './error';
@Injectable({
  providedIn: 'root',
})
export class Http {
  token: string = '';

  constructor(
    private http: HttpClient,
    private error: Error,
  ) {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token') ?? '';
    }
  }

  post<T>(
    apiUrl: string,
    body: any,
    callBack: (res: ResultModel<T>) => void,
    errCallBack?: (err: HttpErrorResponse) => void,
  ) {
    this.http
      .post<ResultModel<T>>(`${api}/${apiUrl}`, body, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: (res) => {
          callBack(res);
        },
        error: (err: HttpErrorResponse) => {
          this.error.errorHandler(err);

          if (errCallBack !== undefined) {
            errCallBack(err);
          }
        },
      });
  }
}
