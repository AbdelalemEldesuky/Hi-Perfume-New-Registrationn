import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpCartService } from 'src/app/shared/services/cart.service';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  map,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  categories : any[] = [];
  tagName :any;
  tagID :any;

  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router,

  ) { }

  ngOnInit() {
  // console.log('categories',this.getCategories())
  console.log('categories',this.getThreeTagsFromApi())
  }

  getThreeTagsFromApi() {
    this.httpCategoryService
      .getThreeTagsFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.categories = data.body.data;
          console.log(this.categories);
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  // getCategories() {
  //   this.httpCategoryService
  //     .getCategoriesFromApi()
  //     .pipe(
  //       takeUntil(this.unsubscribeSignal.asObservable()),
  //       finalize(() => (this.loading = false))
  //     )
  //     .subscribe(
  //       (data: any) => {
  //         this.categories = data.body.data;
  //         console.log(this.categories);
          
  //       },
  //       (err) => {
  //         this.toaster.error(err.error.message);
  //       }
  //     );
  // }

out(){
    $("#filter").css("visibility", "hidden");
  }

  onSearch(value: string) {
    console.log(`filter value: ${value}`);
    localStorage.setItem('tagId',`${value}`);
    this.router.navigateByUrl(
      `/perfumes`
    );
    // this.getTagIDFromApi(value)
  }

  getTagIDFromApi(tagName) { 
    this.httpCategoryService
      .getTagIDFromApi(tagName)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          if(data.body.data[0]){
            this.tagID = data.body.data[0].id ;  
          }
          else{
            this.tagID = ''
          }
          console.log('tttt',this.tagID);
            // this.getSelections() 
            localStorage.setItem('tagId',this.tagID);
            this.router.navigateByUrl(
              `/perfumes`
            );
       
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

}