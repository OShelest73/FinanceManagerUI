import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Notification, NotificationPreview } from '../interfaces/Notification';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.apiBaseUrl;

  getNotifications(userId: string): Observable<NotificationPreview[]> {
    let params = new HttpParams().set('userId', userId);

    return this.http.get<NotificationPreview[]>(this.baseUrl + '/notification', { params })
    .pipe(
      map(data => data)
    );
  }

  getNotificationDetailed(id: string): Observable<Notification> {
    let params = new HttpParams().set('id', id);

    return this.http.get<Notification>(this.baseUrl + '/notification/detailed', { params })
    .pipe(
      map(data => data)
    );
  }

  getNotificationCount(userId: string): Observable<number> {
    let params = new HttpParams().set('userId', userId);

    return this.http.get<number>(this.baseUrl + '/notification/count', { params })
    .pipe(
      map(data => data)
    );
  }

  deleteNotification(id: string): Observable<any> {
    let params = new HttpParams().set('id', id);

    return this.http.delete<number>(this.baseUrl + '/notification', { params })
    .pipe(
      map(data => data)
    );
  }
}
