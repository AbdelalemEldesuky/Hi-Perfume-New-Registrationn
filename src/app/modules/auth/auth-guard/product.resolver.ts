import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpCategoryService } from 'src/app/shared/services/categories.services';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any> {

    constructor(
    private httpCategoryService: HttpCategoryService,
        
    ){

    }
  resolve(next: ActivatedRouteSnapshot): Observable<any> {
  const productId=next.paramMap.get('id')
  const partnerId=next.paramMap.get('partner_id')
    return productId?this.httpCategoryService.getProductDetailsFromApi(productId):EMPTY
  }
}
