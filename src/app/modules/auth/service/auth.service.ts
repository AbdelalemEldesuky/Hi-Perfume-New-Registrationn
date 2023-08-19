import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { state } from '@angular/animations';
import * as countrycitystatejson from 'countrycitystatejson';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private token: string;
  public tokenSubjectSource = new BehaviorSubject<string>('');
  public tokenSubjectData = this.tokenSubjectSource.asObservable();
  public isLogoutSubject = new BehaviorSubject<boolean>(true);
  public isLogoutState$ = this.isLogoutSubject.asObservable();

  public isUserOperationSource = new BehaviorSubject<boolean>(false);
  public isUserOperationState = this.isUserOperationSource.asObservable();
  private countryData = countrycitystatejson;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) { }

  public saveToken(token: string): void {
    localStorage.setItem("muToken", 'Bearer '+token);
    this.tokenSubjectSource.next(token);
    this.isLogoutSubject.next(false);
    this.token = token;
  }

  public getToken(): string {
    let existToken = localStorage.getItem("muToken");
    if (!this.token || !existToken) {
      this.token = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNWU4NjRkYmQ5NDdiNzUwMWIwOWZkN2JiMjFmMjgyN2Y4MjhhYzVjOGYzOWFlYWE4OWNjZTY5NWFjNjA2NjBkMzNiNTM3MzExMWQyNTQ4ZWIiLCJpYXQiOjE2ODkxNzcxMDEuOTU4Mzk3LCJuYmYiOjE2ODkxNzcxMDEuOTU4Mzk5LCJleHAiOjE3MjA3OTk1MDEuOTQ0MTgzLCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.xUZhgQUTX4-GKtFtpG1h_QxsjpoIv0DUMpKIzANxaf26yoYrJWmv2SU9PjHATbdGkfTdwtwE2jRg1HT1LgF_mQKde0awCTbswzf06eGd4LB9sb32KxeQinLhxY1AhvoLrp0wQ8_Nq9fcDTsKVHOPSMPl5Sng7jLJc6XiTHnPoShY4nIu9gGyTPBZkg1vnzAxJqq8OeCMKZP7Vq7C2lFQ1lc-JVJ7DalsXv4zt19A16tZJuj9tGqfEkrKQsxGs200g8zOrwSGtRFKDp_n__LlsbZpx9gAnkHIq8hX7e9nie6g82hm7kMrSNlB8vhx2TH_VJXiRXCoDVXrMnSqdP9L23OD62ylxpD9DZ4SGF_rN0Licr1w_hUZ5CRc9GPz-Hh0vsgqFapcjDO8D3wQWV0yjkbAgRX-4gGVf73n3A3pWe6s00LTR4fhsKb32VQj56_oFTK5pT0useFCMLoKVqAaLStXl5H_0UNQHDB-dbilvhhNe47JMwAXrZMtWfav1iqUxNgRnKRbBAU7svdgs6boIjQshapVV2EmoMHxTgcav6H1OdvtE42G2H3n_znptmujovphnlWMVaBDz9iLrfaKSj8qfb4301pQdIC1NO-6mZzitqpB9QV6WyveaqzjmXPDeshlODFLwySgcGcOxpv3941n1f1lupT1I2DXCXFTXdM`
      localStorage.setItem('guestToken', this.token)
      // this.token = localStorage.getItem("muToken");
      // localStorage.setItem('isLogin', 'false');

    } else {
      this.token = localStorage.getItem("muToken");
    }
    return this.token;
  }

  isToken() {
    return localStorage.getItem('muToken') || undefined;
  }

  logout() {
    localStorage.removeItem('mobile_token');
    localStorage.removeItem('userPhoneNumber');
    localStorage.removeItem('userId');
    localStorage.removeItem('userArea');
    localStorage.removeItem('muToken');
    localStorage.removeItem('firstVisit');
    localStorage.removeItem('guestToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userIsVerfied');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('completeInfo');
    localStorage.removeItem('pickuupData');
    localStorage.setItem('isLogin', 'false');
    this.isLogoutSubject.next(false);
    return this.router.navigate([`/`]);
    // location.reload();
  }


  public getUserIdWhenLoginIn(): string {
    return localStorage.getItem('userId');
  }

  public getUserPhoneNumber(): string {
    return localStorage.getItem('userPhoneNumber');
  }

  public saveUserId(userId) {
    localStorage.setItem('userId', userId);
  }

  public saveUserEmailAddress(email) {
    localStorage.setItem('userEmailAddress', email);
  }
  public saveUserPhoneNumber(phoneNumber) {
    localStorage.setItem('userPhoneNumber', phoneNumber);
  }
  
  public saveUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  public getUserRole() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return userData['roles'][0];
  }

  public register($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}signup`, $userCredentials, {
      observe: "response",
    });
  }
  
  public registerSocialiteLlogin($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}socialite_login`, $userCredentials, {
      observe: "response",
    });
  }

  public login($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, $userCredentials, {
      observe: "response",
    });
  }

  public forgetPassword($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}sendOTP`, $userCredentials, {
      observe: "response",
    });
  }

  public forgetPasswordEmail($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}resendForgetCode`, $userCredentials, {
      observe: "response",
    });
  }



  changePassword(body) {
    const headers = new HttpHeaders({
 
   'Authorization':  localStorage.getItem('muToken')
 });
 return this.http.post(`${this.baseUrl}change_password`,body, {
  headers ,
   observe: 'response'
 })
}

  public varifyCode($code): Observable<any> {
    return this.http.post(`${this.baseUrl}check_activation_code`, $code, {
      observe: "response",
    });
  }
  checkActivationAcode(body) {
    const headers = new HttpHeaders({
 
   'Authorization':  localStorage.getItem('muToken')
 });
 return this.http.post(`${this.baseUrl}check_activation_code`,body, {
  headers ,
   observe: 'response'
 })
}

// varifyCode(body) {
//   const headers = new HttpHeaders({

//  'Authorization':  ""
// });
// return this.http.post(`${this.baseUrl}check_activation_code`,body, {
// headers ,
//  observe: 'response'
// })
// }

  public sendOTP($code): Observable<any> {
    return this.http.post(`${this.baseUrl}sendOTP`, $code, {
      observe: "response",
    });
  }
  public varifyNewPhone(code): Observable<any> {
    return this.http.post(`${this.baseUrl}users/${localStorage.getItem('userId')}/verify-new-phone`, code, {
      observe: "response",
    });
  }
  
  public resendCode($phone): Observable<any> {
    return this.http.post(`${this.baseUrl}sendOTP`, $phone, {
      observe: "response",
    });
  }
  isLoggedIn() {
    return true;
  }

  public completeUserDataApi($data): Observable<any> {
    return this.http.put(`${this.baseUrl}users/${localStorage.getItem('userId')}`, $data, {
      observe: "response",
    });
  }

  public partnerRequest($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}partner_request`, $userCredentials, {
      observe: "response",
    });
  }

  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName);
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state);
  }
}
