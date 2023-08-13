import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private notificationClickedSource = new Subject<any>();
  notificationClicked$ = this.notificationClickedSource.asObservable();

  emitOfferClicked(data: any) {
    this.notificationClickedSource.next(data);
  }
}