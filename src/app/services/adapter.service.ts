import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { MenuApp, RoleWithApp, UserWithRole, UserNotification } from 'app/models/master';
import { AdapterHView, AdapterH, ADAPTERI } from 'app/models/icon.models';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class AdapterService {

  baseAddress: string;
  NotificationEvent: Subject<any>;

  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // Adapter
  CreateAdapter(adapterHView: AdapterHView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Adapter/CreateAdapter`,
      adapterHView,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateAdapter(adapterHView: AdapterHView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Adapter/UpdateAdapter`,
      adapterHView,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllAdapter(): Observable<AdapterH[] | string> {
    return this._httpClient.get<AdapterH[]>(`${this.baseAddress}api/Adapter/GetAllAdapter`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllAdapterItemsByAdapterID(AdapterID: number): Observable<ADAPTERI[] | string> {
    return this._httpClient.get<ADAPTERI[]>(`${this.baseAddress}api/Adapter/GetAllAdapterItemsByAdapterID?AdapterID=${AdapterID}`)
      .pipe(catchError(this.errorHandler));
  }

  // UpdateMenuApp(menuApp: MenuApp): Observable<any> {
  //   return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateApp`,
  //     menuApp,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }

  // DeleteMenuApp(menuApp: MenuApp): Observable<any> {
  //   return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteApp`,
  //     menuApp,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }


}
