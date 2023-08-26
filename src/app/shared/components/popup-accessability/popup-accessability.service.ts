import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessabilityService {
  private notificationClickedSource = new Subject<any>();
  notificationClicked$ = this.notificationClickedSource.asObservable();

  emitAccessabilityComponent(data: any) {
    this.notificationClickedSource.next(data);
  }
}