import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Category } from '../modals/category.modal';
import { ActivatedRoute } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class HttpPropertyService {
    private baseUrl = environment.baseUrl;
    private categoriesSubject = new BehaviorSubject<[]>([]);

    filters = {};

    constructor(
        private _httpClient: HttpClient
    ) {
        this.getPropertiesFromApi({});
    }



    getPropertiesFromApi(queryParams) {
        let params = new HttpParams();
        params = params.append('category', queryParams.category);
        params = params.append('date', queryParams.date || '');
        if(queryParams.startDate) params = params.append('startDate', queryParams.startDate || '');
        if(queryParams.endDate) params = params.append('endDate', queryParams.endDate || '');
        params = params.append('city', queryParams.city || '');
        params = params.append('occasion', queryParams.occasion || '');
        params = params.append('sort', queryParams.sort || '');
        params = params.append('sub_category', queryParams.sub_category || '');
        params = params.append('price_from', queryParams.price_from || '');
        params = params.append('price_to', queryParams.price_to || '');

        params = params.append('rate_from', queryParams.rate_from || '');
        params = params.append('name', queryParams.name || '');
        params = params.append('rate_to', queryParams.rate_to || '');
        params = params.append('capacity_from', queryParams.capacity_from || '');
        params = params.append('capacity_to', queryParams.capacity_to || '');
        params = params.append('pagination', 'true');
        params = params.append('page', String(Number(queryParams.page) - 1));
        params = params.append('limit', '10');
        return this._httpClient.get<Category[]>(`${this.baseUrl}properties`, {
            params: params,
            observe: 'response'
        })
    }

    getOffersFromApi(queryParams) {
        let params = new HttpParams();
        params = params.append('category', queryParams.category);
        params = params.append('date', queryParams.date || '');
        if(queryParams.startDate) params = params.append('startDate', queryParams.startDate || '');
        if(queryParams.endDate) params = params.append('endDate', queryParams.endDate || '');
        params = params.append('city', queryParams.city || '');
        params = params.append('occasion', queryParams.occasion || '');
        params = params.append('sort', queryParams.sort || '');
        params = params.append('sub_category', queryParams.sub_category || '');
        params = params.append('price_from', queryParams.price_from || '');
        params = params.append('price_to', queryParams.price_to || '');
        params = params.append('rate_from', queryParams.rate_from || '');
        params = params.append('rate_to', queryParams.rate_to || '');
        params = params.append('capacity_from', queryParams.capacity_from || '');
        params = params.append('capacity_to', queryParams.capacity_to || '');
        params = params.append('board', 'portal');
        params = params.append('pagination', 'true');
        params = params.append('page', String(Number(queryParams.page) - 1));
        params = params.append('limit', '10');
        return this._httpClient.get<Category[]>(`${this.baseUrl}offers`, {
            params: params,
            observe: 'response'
        });
    }


    setPropertiesData(categories) {
        this.categoriesSubject.next(categories);
    }
    getPropertiesSource() {
        return this.categoriesSubject.asObservable();
    }

    getSingleProperty(propertyId, query) {
        let params = new HttpParams();
        params = params.append('date', query.date || '');
        if(query.startDate) params = params.append('startDate', query.startDate || '');
        if(query.endDate) params = params.append('endDate', query.endDate || '');
        return this._httpClient.get(`${this.baseUrl}properties/${propertyId}`, {
            params: params,
            observe: 'response'
        })
    }

    getSingleCategory(categoryId) {
        let params = new HttpParams();
        return this._httpClient.get(`${this.baseUrl}categories/${categoryId}`, {
            params: params,
            observe: 'response'
        })
    }

    getPropertyAllReviews(propertyId) {
        let params = new HttpParams();
        return this._httpClient.get(`${this.baseUrl}properties/${propertyId}/rates`, {
            params: params,
            observe: 'response'
        })
    }

}