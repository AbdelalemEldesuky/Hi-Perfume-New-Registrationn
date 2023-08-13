import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Area } from '../modals/area.modal';


@Injectable({
    providedIn: 'root'
})
export class HttpAreaService {
    private baseUrl = environment.baseUrl;
    private areasSubject = new BehaviorSubject<[]>([]);
    private subAreasSubject = new BehaviorSubject<[]>([]);

    constructor(
        private _httpClient: HttpClient
    ) {
        this.getAreasFromApi();
    }
    
    getAreasFromApi() {
        return this._httpClient.get<Area[]>(`${this.baseUrl}areas`, {
            observe: 'response'
        })
    }

    getSingleArea(areaId) {
        return this._httpClient.get(`${this.baseUrl}areas/${areaId}`, {
            observe: 'response'
        })
    }
    addUserAddresses(id,body){
        return this._httpClient.post(`${this.baseUrl}users/${id}/addresses`, body,{
            observe: 'response'
        })
    }
}