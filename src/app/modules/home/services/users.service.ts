import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { map } from "rxjs/operators";
import * as globlas from "../../auth/auth-guard/globlas";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.baseUrl;
  userData = JSON.parse(localStorage.getItem('userData'));
  constructor(
    private httpClient: HttpClient,
    private gtn: globlas.GetTokenNow

  ) { }


  getAllUsers($sName = '', $sCar = '', $sMobile = '') {
    let params = new HttpParams();
    params = params.append('fullName', $sName);
    params = params.append('carNumbers', $sCar);
    params = params.append('mobile', $sMobile);
    return this.httpClient.get(`${this.baseUrl}getAllUsers`, {
      params: params,
      observe: 'response'
    })
  }

  getSingleUser() {
    return this.httpClient.get(`${this.baseUrl}${this.userData._id}`, {
      observe: 'response'
    })
  }
  // getUserData() {
  //   return this.httpClient.get(`${this.baseUrl}users/${this.userData._id}`, {
  //     observe: 'response'
  //   })
  // }
  getCountries() {
    return this.httpClient.get(`${this.baseUrl}countries`, {
      observe: 'response'
    })
  }

  getStates(country_id) {
    return this.httpClient.get(`${this.baseUrl}states?country_id=${country_id}`, {
      observe: 'response'
    })
  }
  getCities(country_id,state_id) {
    return this.httpClient.get(`${this.baseUrl}cities?country_id=${country_id}&state_id=${state_id}`, {
      observe: 'response'
    })
  }
  getUserData(): Observable<any> {
    return this.httpClient
      .get(`${this.baseUrl}users/${this.userData.id}`, this.gtn.headers())
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }
  getProfile(): Observable<any> {
    return this.httpClient
      .get(`${this.baseUrl}my_profile`, this.gtn.headerProfile(localStorage.getItem('muToken')))
      .pipe(
        map((res) => {
          return res as any;
        })
      );
  }


  deleteMyAccount() {
    const headers = new HttpHeaders({
      'Authorization':  this.userData.access_token
    });
    return this.httpClient.post(`${this.baseUrl}deleteMyAccount`, {
     headers ,
      observe: 'response'
    })
  }

  updateUser(body) {
       const headers = new HttpHeaders({
      'Authorization':  localStorage.getItem('muToken')
    });
    return this.httpClient.post(`${this.baseUrl}update_profile`,body, {
     headers ,
      observe: 'response'
    })
  }

  updateUserPassword(body) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':  localStorage.getItem('muToken')
    });
    return this.httpClient.post(`${this.baseUrl}change_password`, body, {
     headers ,
      observe: 'response'
    })
  }
}
