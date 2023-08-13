import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Subject,Observable } from 'rxjs';
import { map } from "rxjs/operators";
import * as globlas from "../../modules/auth/auth-guard/globlas";


@Injectable({
    providedIn: 'root'
})
export class HttpOrderService {
    private baseUrl = environment.baseUrl;
    private filterSubject = new BehaviorSubject<{}>({});
    public closeSideBarSubject = new Subject();
    userData = JSON.parse(localStorage.getItem('userData'));

    constructor(
        private _httpClient: HttpClient,
    private gtn: globlas.GetTokenNow

    ) {
    }

    allUserOrders(): Observable<any> {
        return this._httpClient
          .get(`${this.baseUrl}all_user_orders`, this.gtn.headerProfile(localStorage.getItem('muToken')))
          .pipe(
            map((res) => {
              return res as any;
            })
          );
      }
    deleteOrder(orderId){
        return this._httpClient.delete(`${this.baseUrl}delete_order/${orderId}`,{
            observe: 'response'
        })
    }
    orderInformation(orderId){
        return this._httpClient.get(`${this.baseUrl}order_information/${orderId}`,{
            observe: 'response'
        })
    }

    makeOrder(body) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('muToken')
          });
        return this._httpClient.post(`${this.baseUrl}make_order`,body, {
            headers,
          observe: 'response'
        })
      }

      addShipping(body) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('muToken')
          });
        return this._httpClient.post(`${this.baseUrl}add_shipping`,body, {
            headers,
          observe: 'response'
        })
      }

    changeOrderStatus(body){
        return this._httpClient.post(`${this.baseUrl}change_order_status`, body,{
            observe: 'response'
        })
    }

}