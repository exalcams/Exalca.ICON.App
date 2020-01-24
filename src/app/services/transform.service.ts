import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { MenuApp, RoleWithApp, UserWithRole, UserNotification } from 'app/models/master';
import { AdapterHView, AdapterH, ADAPTERI, TRFHView, TRFH, TRFI, TransformationAdapterView } from 'app/models/icon.models';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TransformService {

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

  // Transform
  CreateTransform(tRFHView: TRFHView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Transform/CreateTransform`,
      tRFHView,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateTransform(tRFHView: TRFHView): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Transform/UpdateTransform`,
      tRFHView,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransform(): Observable<TRFH[] | string> {
    return this._httpClient.get<TRFH[]>(`${this.baseAddress}api/Transform/GetAllTransform`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransformationAdapterView(): Observable<TransformationAdapterView[] | string> {
    return this._httpClient.get<TransformationAdapterView[]>(`${this.baseAddress}api/Transform/GetAllTransformationAdapterView`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllTransformItemsByTransformID(TransformID: number): Observable<TRFI[] | string> {
    return this._httpClient.get<TRFI[]>(`${this.baseAddress}api/Transform/GetAllTransformItemsByTransformID?TransformID=${TransformID}`)
      .pipe(catchError(this.errorHandler));
  }
}
