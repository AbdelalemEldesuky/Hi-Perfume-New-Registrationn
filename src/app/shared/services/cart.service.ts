import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject ,Observable} from 'rxjs';
import * as globlas from "../../modules/auth/auth-guard/globlas";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class HttpCartService {
    private baseUrl = environment.baseUrl;
    userData = JSON.parse(localStorage.getItem('userData'));

    private filterSubject = new BehaviorSubject<{}>({});
    public closeSideBarSubject = new Subject();
    constructor(
        private _httpClient: HttpClient,
    private gtn: globlas.GetTokenNow

    ) {
    }


    addToCart(body) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':localStorage.getItem('muToken')
          });
        return this._httpClient.post(`${this.baseUrl}carts/add`,body, {
            headers,
          observe: 'response'
        })
      }

      addFavorite(body) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':localStorage.getItem('muToken')
          });
        return this._httpClient.post(`${this.baseUrl}add_favorite`,body, {
            headers,
          observe: 'response'
        })
      }
 
    getCart(): Observable<any> {
        return this._httpClient
          .get(`${this.baseUrl}carts`, this.gtn.headerProfile(localStorage.getItem('muToken')))
          .pipe(
            map((res) => {
              return res as any;
            })
          );
      }
      getOrderDetailsFromApi(id): Observable<any> {
        return this._httpClient
          .get(`${this.baseUrl}order_information/${id}`, this.gtn.headerProfile(localStorage.getItem('muToken')))
          .pipe(
            map((res) => {
              return res as any;
            })
          );
      }
    
      getFavorites(): Observable<any> {
        return this._httpClient
          .get(`${this.baseUrl}favorites`, this.gtn.headerProfile(localStorage.getItem('muToken')))
          .pipe(
            map((res) => {
              return res as any;
            })
          );
      }

    deleteAllCart(){
        return this._httpClient.delete(`${this.baseUrl}carts/delete_all`,{
            observe: 'response'
        })
    }
    deleteCart(cartId){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':localStorage.getItem('muToken')
          });
        return this._httpClient.delete(`${this.baseUrl}carts/${cartId}/delete`,{
            headers,
            observe: 'response'
        })
    }
    updateCart(body){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':localStorage.getItem('muToken')
          });
        return this._httpClient.post(`${this.baseUrl}carts/update`, body,{
            headers,
            observe: 'response'
        })
    }
    promoCode(body){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization':localStorage.getItem('muToken')
          });
        return this._httpClient.post(`${this.baseUrl}apply_promocode`, body,{
            headers,
            observe: 'response'
        })
    }


    ////////////////////////////////////////////
    
    getAllCities() {
        return this._httpClient.get<any[]>(`${this.baseUrl}carts`, {
            observe: 'response'
        })
    }

    getAllOccasions() {
        return this._httpClient.get<any[]>(`${this.baseUrl}occasions`, {
            observe: 'response'
        })
    }
    getAllCategories() {
        return this._httpClient.get<any[]>(`${this.baseUrl}categories`, {
            observe: 'response'
        })
    }

    getFilterSubject() {
        return this.filterSubject.asObservable();
    }

    getAboutUs() {
        return this._httpClient.get(`${this.baseUrl}configuration`, {
            observe: 'response'
        })
    }


    setFilterData(query) {
        this.filterSubject.next(query);
    }




}