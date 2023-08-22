import { Injectable , EventEmitter} from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable, timer,Subject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Category } from '../modals/category.modal';
import { map } from "rxjs/operators";
import * as globlas from "../../modules/auth/auth-guard/globlas";


@Injectable({
    providedIn: 'root'
})
export class HttpCategoryService {
    refreshEvent: EventEmitter<any> = new EventEmitter();
    private baseUrl = environment.baseUrl;
    private categoriesSubject = new BehaviorSubject<[]>([]);
    private subCategoriesSubject = new BehaviorSubject<[]>([]);
    private subjectName = new Subject<any>(); 

    constructor(
        private _httpClient: HttpClient,
    private gtn: globlas.GetTokenNow

    // private gtn: globlas.GetTokenNow
    ) {
        this.getSlidersFromApi();
        // this.getSelectionsFromApi();
    }


  refresh() {
    this.refreshEvent.emit();
  }
    sendUpdate(message: string) { //the component that wants to update something, calls this fn
        this.subjectName.next({ text: message }); //next() will feed the value in Subject
    }

    getUpdate(): Observable<any> { //the receiver component calls this function 
        return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }

    getSlidersFromApi() {
        return this._httpClient.get<Category[]>(`${this.baseUrl}sliders`, {
            observe: 'response'
        })
    }
    getCategoriesFromApi() {
        return this._httpClient.get<Category[]>(`${this.baseUrl}categories`, {
            observe: 'response'
        })
    }
    getServicesFromApi() {
        return this._httpClient.get(`${this.baseUrl}services`, {
            observe: 'response'
        })
    } 
    getStoriesFromApi() {
        return this._httpClient.get(`${this.baseUrl}stories`, {
            observe: 'response'
        })
    } 
    getAboutFromApi() {
        return this._httpClient.get(`${this.baseUrl}page/about_us`, {
            observe: 'response'
        })
    }     
    getFAQSFromApi() {
        return this._httpClient.get(`${this.baseUrl}faqs`, {
            observe: 'response'
        })
    }   
    getPrivacyPolicyFromApi() {
        return this._httpClient.get(`${this.baseUrl}page/privacy_policy`, {
            observe: 'response'
        })
    }  
    getTermConditionsFromApi(pageName) {
        return this._httpClient.get(`${this.baseUrl}page/${pageName}`, {
            observe: 'response'
        })
    }      
    getTagIDFromApi(tagName) {
        return this._httpClient.get(`${this.baseUrl}tags?tags[]=${tagName}`, {
            observe: 'response'
        })
    }
    getAllTagsFromApi() {
        return this._httpClient.get(`${this.baseUrl}tags`, {
            observe: 'response'
        })
    }
    getThreeTagsFromApi() {
        return this._httpClient.get(`${this.baseUrl}tags?tags[]=unisex&tags[]=men&tags[]=woman`, {
            observe: 'response'
        })
    }
    getProductDetailsFromApi(id) {
        // return this._httpClient.get(`${this.baseUrl}products/${id}`, {
        //     observe: 'response'
        // })

        return this._httpClient
        .get(`${this.baseUrl}products/${id}`, this.gtn.headerProfile(localStorage.getItem('muToken')))
        .pipe(
          map((res) => {
            return res as any;
          })
        );
    }
  
    getProductsByCategoryFromApi(categoryId) {
            return this._httpClient
            .get(`${this.baseUrl}products?category_id=${categoryId}`, this.gtn.headerProfile(localStorage.getItem('muToken')))
            .pipe(
              map((res) => {
                return res as any;
              })
            );
        }

    getSelectionsFromApi(tagID) {
    //   return this._httpClient.get(`${this.baseUrl}products?tags[1]=${tagID}`, {
    //         observe: 'response'
    //     })


        return this._httpClient
        .get(`${this.baseUrl}products?tags[1]=${tagID}`, this.gtn.headerProfile(localStorage.getItem('muToken')))
        .pipe(
          map((res) => {
            return res as any;
          })
        );
    }
    getProductsByPaginationFromApi(pagination) {
     

        return this._httpClient
        .get(`${this.baseUrl}products?page=${pagination}`, this.gtn.headerProfile(localStorage.getItem('muToken')))
        .pipe(
          map((res) => {
            return res as any;
          })
        );
    }
    getDiscoverProductsFromApi(tagID) {
        return this._httpClient.get(`${this.baseUrl}products?tags[1]=${tagID}`, {
            observe: 'response'
        })
    }
    getProductsFromApi() {
        // return this._httpClient.get(`${this.baseUrl}products`, this.gtn.headerProfile(localStorage.getItem('muToken'))) {
        //     observe: 'response'
        // })

        return this._httpClient
          .get(`${this.baseUrl}products`, this.gtn.headerProfile(localStorage.getItem('muToken')))
          .pipe(
            map((res) => {
              return res as any;
            })
          );
    }
    getProductsFilterFromApi(priceSort,price,categoryID) {

        return this._httpClient
        .get(`${this.baseUrl}products?price=${price}&priceSort=${priceSort}&category_id=${categoryID}`, this.gtn.headerProfile(localStorage.getItem('muToken')))
        .pipe(
          map((res) => {
            return res as any;
          })
        );
    }
    sendContactUS(body) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization':  localStorage.getItem('muToken')
        });
        return this._httpClient.post(`${this.baseUrl}newsletter`, body, {
         headers ,
          observe: 'response'
        })
      }

      addComment(body) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization':  localStorage.getItem('muToken')
        });
        return this._httpClient.post(`${this.baseUrl}addComment`, body, {
         headers ,
          observe: 'response'
        })
      }
    // getProductsFromApi(): Observable<any> {
    //     return this._httpClient
    //       .get(`${this.baseUrl}products?keyword=Mollitia22`, this.gtn.headerGet())
    //       .pipe(
    //         map((res) => {
    //           return res as any;
    //         })
    //       );
    //   }
    // getProductsFromApi(): Observable<any> {
    //     return this._httpClient
    //       .get(`${this.baseUrl}products?keyword=Mollitia22`)
    //       .pipe(
    //         map((res) => {
    //           return res as any;
    //         })
    //       );
    //   }
    getCategoryFromApi(id) {
        return this._httpClient.get<Category[]>(`${this.baseUrl}categories/${id}`, {
            observe: 'response'
        })
    }
    getMinimumChargesFromApi(id) {
        return this._httpClient.get<Category[]>(`${this.baseUrl}categories/${id}/minimumCharges`, {
            observe: 'response'
        })
    }
    getsubCategoriesFromApi(id) {
        return this._httpClient.get<Category[]>(`${this.baseUrl}categories/${id}/subCategories`, {
            observe: 'response'
        })
    }

    getsubCategoryFromApi(id, subId) {
        return this._httpClient.get<Category[]>(`${this.baseUrl}categories/${id}/subCategories/${subId}`, {
            observe: 'response'
        })
    }

    getsubCategoriesServicesFromApi(id, subId) {
        const userArea = localStorage.getItem("userArea") ? JSON.parse(localStorage.getItem("userArea")) : "";
        const areaId = userArea ? userArea._id : "";
        // const areaId = "6149cfc89e9f7387824289b0";
        return this._httpClient.get<Category[]>(`${this.baseUrl}categories/${id}/subCategories/${subId}/services?area=${areaId}`, {
            observe: 'response'
        })
    }

    getSingleCategory(categoryId) {
        return this._httpClient.get(`${this.baseUrl}categories/${categoryId}`, {
            observe: 'response'
        })
    }

    getHomeBannersFromApi() {
        return this._httpClient.get<Category[]>(`${this.baseUrl}homeBanners`, {
            observe: 'response'
        })
    }

    getCharitiesFromApi() {
        return this._httpClient.get<Category[]>(`${this.baseUrl}charities`, {
            observe: 'response'
        })
    }

    
    getBestCitiesFromApi() {
        return this._httpClient.get(`${this.baseUrl}properties/cities`, {
            observe: 'response'
        })
    }

    getFeaturedPropertiesFromApi() {
        return this._httpClient.get(`${this.baseUrl}properties?appear_in_home=true`, {
            observe: 'response'
        })
    }

    // getSubCategoryFromApi(categoryId) {
    //     return this._httpClient.get(`${this.baseUrl}categories/${categoryId}/subCategories`, {
    //         observe: 'response'
    //     });
    // }

    addCharity(body){
        return this._httpClient.post(`${this.baseUrl}charities`, body, {
            observe: 'response'
        })
    }
    addBookingReview(id,body){
        return this._httpClient.post(`${this.baseUrl}bookings/${id}/rates`, body,{
            observe: 'response'
        })
    }
    addServiceToCart(id,body){
        return this._httpClient.put(`${this.baseUrl}users/${id}/cart`, body,{
            observe: 'response'
        })
    }
    createOrders(body){
        return this._httpClient.post(`${this.baseUrl}orders`, body,{
            observe: 'response'
        })
    }
    updateOrders(id,body){
        return this._httpClient.put(`${this.baseUrl}orders/${id}/cart`, body,{
            observe: 'response'
        })
    }
    getUserCart(id){
        return this._httpClient.get(`${this.baseUrl}users/${id}/cart`,{
            observe: 'response'
        })
    }
    getUserAddresses(id){
        return this._httpClient.get(`${this.baseUrl}users/${id}/addresses`,{
            observe: 'response'
        })
    }
    deleteServiceFromCart(idUser,idService){
        return this._httpClient.delete(`${this.baseUrl}users/${idUser}/cart/${idService}`,{
            observe: 'response'
        })
    }
 
    private setCategoriesSubject(categories) {
        this.categoriesSubject.next(categories);
    }
    getCategoriesDataSource() {
        return this.categoriesSubject.asObservable();
    }
   getConfigurations() {
        return this._httpClient.get(`${this.baseUrl}configurations`,{
            observe: 'response'
        })
    }
    updateOrder(id, body) {
        return this._httpClient.put(`${this.baseUrl}orders/${id}`, body, {
            observe: 'response'
        })
    }
    getPromoCodes(code) {
        return this._httpClient.get(`${this.baseUrl}promoCodes/check?code=${code}`, {
            observe: 'response'
        })
    }
}