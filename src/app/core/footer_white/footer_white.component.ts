import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  Renderer2,
  DoCheck,
  OnDestroy,
  TemplateRef
} from "@angular/core";
import * as $ from 'jquery';

import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { HttpCartService } from 'src/app/shared/services/cart.service';
import { map, takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { ToastrService } from "ngx-toastr";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  filter,
} from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: 'app-footer-white',
  templateUrl: './footer_white.component.html',
  styleUrls: ['./footer_white.component.scss']
})
export class FooterWhiteComponent implements OnInit, OnDestroy {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;


  config: any;
  unsubscribeSignal: Subject<void> = new Subject();
  language: any = localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE");
  modalRef: BsModalRef;
  loading = true;
  tagID :any;
  tags :any;

  constructor(
    private HttpCartService: HttpCartService,
    private modalService: BsModalService,
    private elementRef: ElementRef,
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.getTagIDFromApi("brands")
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
          this.tagID = data.body.data[0].id;  
          this.tags = data.body.data[0]
          console.log('ttttBest Sele',this.tagID);
        if(this.tagID){
          // this.getSelections() 
      }
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  openBrand(){
    localStorage.setItem('tagId',this.tagID);
    this.router.navigateByUrl(
      `/perfumes`
    );
  }
  
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }

  openPrivicyPolicy(){
    localStorage.setItem('privicyPolicy','true')
  }

  openModal(template: TemplateRef<any>) {
    const config = {
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config);
  }

  closeModal() {
    this.modalRef.hide();
  }
}
