import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { cardAnimation } from 'src/app/shared/animations/animation';
@Component({
  selector: 'app-list-homeBanners',
  templateUrl: './list-homeBanners.component.html',
  styleUrls: ['./list-homeBanners.component.scss'],
  animations: [
    cardAnimation
  ]
})
export class ListHomeBannersComponent implements OnInit, OnDestroy {
  loading = true;
  homeBanners$: any = [];
  unsubscribeSignal: Subject<void> = new Subject();
  style: string;
  currentLanguage: string;
  constructor(
    private httpCategoryService: HttpCategoryService
  ) { }

  ngOnInit() {
    this.currentLanguage = localStorage.getItem("current-language");
    // this.httpCategoryService.getHomeBannersFromApi().pipe(
    //   takeUntil(this.unsubscribeSignal.asObservable()),
    //   finalize(() => this.loading = false)
    // ).subscribe(data => {
    //   this.homeBanners$ = data.body;
    // })
  }
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }



}
