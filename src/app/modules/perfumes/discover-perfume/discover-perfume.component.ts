import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-discover-perfume',
  templateUrl: './discover-perfume.component.html',
  styleUrls: ['./discover-perfume.component.scss']
})
export class DiscoverPerfumeComponent implements OnInit {

  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  categories : any[] = [];
  tagName = ['gifts', 'best seller'];

  tagID :any;

  tags = [];
  selectedTags = [];
  dropdownOpen = false;
  productsDiscover : any[] =[];
  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
  // console.log('categories',this.getCategories())
  localStorage.removeItem('prouductByDiscover')
this.getThreeTagsFromApi()

  
  }

toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  addTag(tag) {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    this.getTagIDFromApi(tag)

    }
  }

  removeTag(tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    }

  }
  
  getCategories() {
    this.httpCategoryService
      .getCategoriesFromApi()
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

out(){
    $("#filter").css("visibility", "hidden");
  }

  onSearch() {
    if(this.productsDiscover.length>0){
    this.router.navigateByUrl(
      `/perfumes`
    );
    }
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
          console.log('tttttagIDtagID',data);
          console.log('tttt',this.tagID);
            // this.getSelections() 
            // localStorage.setItem('discoverTagId',this.tagID);
            // this.router.navigateByUrl(
            //   `/perfumes`
            // );
            this.httpCategoryService
            .getDiscoverProductsFromApi(this.tagID)
            .pipe(
              takeUntil(this.unsubscribeSignal.asObservable()),
              finalize(() => (this.loading = false))
            )
            .subscribe(
              (data: any) => {
                const resp = data.body.data.items;
                this.productsDiscover.push(resp);
                this.productsDiscover = [].concat(...this.productsDiscover);
                localStorage.setItem('prouductByDiscover',JSON.stringify(this.productsDiscover))
            console.log('##FFFFFFprouductByDiscover',this.productsDiscover)
              },
              (err) => {
                this.toaster.error(err.error.message);
              }
            );
       
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  getThreeTagsFromApi() { 
    this.httpCategoryService
      .getThreeTagsFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (res: any) => {
            this.tags = res.body.data;  
            console.log('tags',this.tags);
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }
}
