import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationClickedSource = new Subject<any>();
  notificationClicked$ = this.notificationClickedSource.asObservable();

  emitNotificationClicked(data: any) {
    this.notificationClickedSource.next(data);
  }
}