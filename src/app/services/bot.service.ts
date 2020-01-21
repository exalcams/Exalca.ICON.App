import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { BOTHView, BOTH } from 'app/models/icon.models';

@Injectable({
  providedIn: 'root'
})
export class BotService {

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

  // BOT
  CreateBOT(bOTH: BOTH): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/BOT/CreateBOT`,
      bOTH,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateBOT(bOTH: BOTH): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/BOT/UpdateBOT`,
      bOTH,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllBOTHeaders(): Observable<BOTHView[] | string> {
    return this._httpClient.get<BOTHView[]>(`${this.baseAddress}api/BOT/GetAllBOTHeaders`)
      .pipe(catchError(this.errorHandler));
  }

  GetBOTByBOTID(BOTID: number): Observable<BOTH | string> {
    return this._httpClient.get<BOTH>(`${this.baseAddress}api/BOT/GetBOTByBOTID?BOTID=${BOTID}`)
      .pipe(catchError(this.errorHandler));
  }

}
