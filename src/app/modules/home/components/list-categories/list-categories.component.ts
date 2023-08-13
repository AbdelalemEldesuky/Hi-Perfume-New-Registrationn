import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { cardAnimation } from 'src/app/shared/animations/animation';
@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss'],
  animations: [
    cardAnimation
  ]
})
export class ListCategoriesComponent implements OnInit, OnDestroy {
  loading = true;
  categories$: any = [];
  unsubscribeSignal: Subject<void> = new Subject();
  currentLanguage: string;
  constructor(
    private httpCategoryService: HttpCategoryService
  ) { }

  ngOnInit() {
    this.currentLanguage = localStorage.getItem("current-language")
    // this.httpCategoryService.getProductsFromApi().pipe(
    //   takeUntil(this.unsubscribeSignal.asObservable()),
    //   finalize(() => this.loading = false)
    // ).subscribe(data => {
    //   this.categories$ = data.body;
    //   const offerCategry = {
    //     image: '/assets/image/offer-en.png',
    //     name: 'Special Offers',
    //     _id: 'offers'
    //   }
    //   if(this.currentLanguage === 'ar') {
    //     offerCategry.name = "العروض الخاصه";
    //     offerCategry.image = "/assets/image/offer-ar.png";
    //   }
    //   this.categories$.push(offerCategry)
    // })
  }
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }



}
