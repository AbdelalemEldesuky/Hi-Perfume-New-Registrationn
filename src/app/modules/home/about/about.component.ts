import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
} from "@angular/core";
import { NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { HttpResponse } from "@angular/common/http";

import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Router } from "@angular/router";
import { HttpCartService } from "src/app/shared/services/cart.service";

interface Slide_ {
  name: string;
  backgroundColor: string;
}

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponentComponent implements OnInit {

  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  about :any;

 
 

  constructor(
    private httpCategoryService: HttpCategoryService,
    private httpCartService: HttpCartService,
    private toaster: ToastrService,
    private router: Router

  ) {}

  ngOnInit() {
    this.getAboutFromApi()


    
  }
  
  getAboutFromApi() {
    this.httpCategoryService
      .getAboutFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.about = data.body.data;          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

}
