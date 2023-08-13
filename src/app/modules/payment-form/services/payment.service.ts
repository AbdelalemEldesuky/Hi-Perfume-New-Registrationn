import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: "root"
})
export class HttpPaymentService {
    baseUrl = environment.baseUrl;
    constructor(
        private httpClient: HttpClient
    ) { }


    payNowApi(payment_type) {
        const reservationDate = localStorage.getItem('reservationDate');
        const body = {
            date: reservationDate,
            payment_type: payment_type,
        }
        const property = JSON.parse(localStorage.getItem('property'));
        return this.httpClient.post(`${this.baseUrl}properties/${property._id}/users/${localStorage.getItem('userId')}/bookings`, body, {
            observe: 'response'
        })
    }


    payForPayfort(body) {
        // const body = new FormData();
        // // body.append('form', JSON.stringify(paymentBody))
        // body.append('service_command', paymentBody.service_command);
        // body.append('access_code', paymentBody.access_code);
        // body.append('signature', paymentBody.signature);
        // body.append('language', paymentBody.language);
        // body.append('merchant_identifier', paymentBody.merchant_identifier);
        // body.append('merchant_reference', paymentBody.merchant_reference);
        // body.append('expiry_date', paymentBody.expiry_date);
        // body.append('card_security_code', paymentBody.card_security_code);
        // body.append('card_number', paymentBody.card_number)
        console.log(body);
        return this.httpClient.post<any>(`${environment.baseUrl}pay/front`, body, {
            observe: 'response'
        })

    }




}