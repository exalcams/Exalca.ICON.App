import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AdapterH, ADAPTERI } from 'app/models/icon.models';
import { catchError } from 'rxjs/operators';
import { SourceAdapterView } from 'app/models/SRC_H';

@Injectable({
  providedIn: 'root'
})
export class SourcedefinationService {
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

  GetAllAdapter(): Observable<ADAPTERI[] | string> {
    return this._httpClient.get<ADAPTERI[]>(`${this.baseAddress}api/Source/GetAllApdater`)
      .pipe(catchError(this.errorHandler));
  }
  GetAdapterById(AdapterID: number): Observable<ADAPTERI[] | string> {
    return this._httpClient.get<ADAPTERI[]>(`${this.baseAddress}api/Source/GetAdapterById?AdapterID=${AdapterID}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllSourceAdapterView(): Observable<SourceAdapterView[] | string> {
    return this._httpClient.get<SourceAdapterView[]>(`${this.baseAddress}api/Source/GetAllSourceAdapterView`)
      .pipe(catchError(this.errorHandler));
  }
}
