import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import * as $ from 'jquery';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  Renderer2,
  TemplateRef,
  OnDestroy,
  DoCheck,
  ChangeDetectorRef
} from "@angular/core";
import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import {
  takeUntil,
  take,
  takeLast,
  distinctUntilChanged,
  debounceTime,
  finalize,
  delay,
  share,
} from "rxjs/operators";
import { AuthService } from "src/app/modules/auth/service/auth.service";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: "app-refer",
  templateUrl: "./refer.component.html",
  styleUrls: ["./refer.component.scss"],
})


export class ReferComponent implements OnInit, OnDestroy ,DoCheck{
  @ViewChild("rate", { static: true }) rate: TemplateRef<any>;
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild("modalone", { static: false }) public modalone: ModalDirective;
  isShow = true;
  modalRef: BsModalRef;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_iso=CountryISO.UnitedStates
  loading: boolean = false;
  userData = {};
  svgWidth: number;
  unsubscribeSignal: Subject<void> = new Subject();
  repsData = {};
  separateDialCode = false;
  userId=localStorage.getItem('userId')
  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private toaster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}



  ngOnInit() {
    $(document).on('click', '.cool_btn', function(){
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($('.ref_url').text()).select();
      document.execCommand("copy");
      $temp.remove();
    
      $('.ref_url_copied2').addClass('oi');
      setTimeout(function () { 
      $('.ref_url_copied2').removeClass('oi');
      }, 2000);
    });
    
  

  
  }
  ngOnDestroy() {
  
  }
  ngDoCheck(): void {
  
   }
   facbookShare() {
    const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
    const url_= `https://hiperfumeusa.com/refer/${userId}`
  console.log('ts---',url_);
    var facebookWindow = window.open(
    'https://www.facebook.com/sharer/sharer.php?u=' + url_,
    'facebook-popup',
    'height=350,width=600'
    );
    if (facebookWindow.focus) {
    facebookWindow.focus();
    }
    return false;
    }

    shareOnWhatsapp() {
      const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
      const url_=  `https://hiperfumeusa.com/refer/${userId}`
      const url = `https://wa.me?text=${url_}`;
      window.open(url, '_blank');
    }

    messengerShare() {

      const userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '0';
      const url = `https://hiperfumeusa.com/refer/${userId}`;
      const messengerWindow = window.open(
        `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(url)}`,
        'messenger-popup',
        'height=350,width=600'
      );
      if (messengerWindow.focus) {
        messengerWindow.focus();
      }
      return false;
      // window.open('fb-messenger://share?link=' + encodeURIComponent(url) + '&app_id=' + encodeURIComponent(''));
    }

}
