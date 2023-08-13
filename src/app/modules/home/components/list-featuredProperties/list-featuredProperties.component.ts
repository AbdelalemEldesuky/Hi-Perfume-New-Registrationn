import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { cardAnimation } from 'src/app/shared/animations/animation';
@Component({
  selector: 'app-list-featuredProperties',
  templateUrl: './list-featuredProperties.component.html',
  styleUrls: ['./list-featuredProperties.component.scss'],
  animations: [
    cardAnimation
  ]
})
export class ListFeaturedPropertiesComponent implements OnInit, OnDestroy {
  loading = true;
  featuredProperties$: any = [];
  unsubscribeSignal: Subject<void> = new Subject();
  currentLanguage: string;
  constructor(
    private httpCategoryService: HttpCategoryService
  ) { }

  ngOnInit() {
    this.currentLanguage = localStorage.getItem("current-language");
    this.httpCategoryService.getFeaturedPropertiesFromApi().pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => this.loading = false)
    ).subscribe(data => {
      this.featuredProperties$ = data.body;
    })
  }
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }



}
