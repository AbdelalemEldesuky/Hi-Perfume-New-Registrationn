import { Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { OfferService } from './popup-offer.service';
import { ToastrService } from 'ngx-toastr';
import { HttpCategoryService } from '../../services/categories.services';
import { FormBuilder, Validators } from "@angular/forms";
import { Subject } from 'rxjs';
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
import { HttpClient, HttpResponse } from "@angular/common/http";

@Component({
  selector: 'app-popup-offer',
  templateUrl: './popup-offer.component.html',
  styleUrls: ['./popup-offer.component.scss']
})
export class PopupOfferComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() sub_name: string;

  
  isLoggedIn = localStorage.getItem("isLogin");
  unsubscribeSignal: Subject<void> = new Subject();
  loading: boolean = false;
  subscribe: boolean = false;

  constructor(private offerService: OfferService,
    private toaster: ToastrService,
    private fg: FormBuilder,
    private httpCategoryService: HttpCategoryService,

    ) {}

  public subscribeForm = this.fg.group({
    email: ["", Validators.required],
  });

  ngOnInit() {
    $(document).ready(function () {
      // jQuery extend functions for popup
      (function ($) {
        $.fn.openPopup = function (settings) {
          var elem = $(this);
          // Establish our default settings
          var settings = $.extend(
            {
              anim: "fade"
            },
            settings
          );
          elem.show();
          elem.find(".popup-content").addClass(settings.anim + "In");
        };
      
        $.fn.closePopup = function (settings) {
          var elem = $(this);
          // Establish our default settings
          var settings = $.extend(
            {
              anim: "fade"
            },
            settings
          );
          elem
            .find(".popup-content")
            .removeClass(settings.anim + "In")
            .addClass(settings.anim + "Out");
      
          setTimeout(function () {
            elem.hide();
            elem.find(".popup-content").removeClass(settings.anim + "Out");
          }, 500);
        };
      })($);
      
      // Click functions for popup
      $(".open-popup").click(function () {
        $("#" + $(this).data("id")).openPopup({
          anim:
            !$(this).attr("data-animation") || $(this).data("animation") == null
              ? "fade"
              : $(this).data("animation")
        });
      });
      $(".close-popup").click(function () {
        $("#" + $(this).data("id")).closePopup({
          anim:
            !$(this).attr("data-animation") || $(this).data("animation") == null
              ? "fade"
              : $(this).data("animation")
        });
      });
        });
}


// closePopup(){
//   this.offerService.emitOfferClicked({ image: this.image, name: this.name ,sub_name:this.sub_name});
// }

submit() { 
  const data = this.subscribeForm.value;
  if (!data.email) {
    const message ="Please Enter Your Email";
    this.toaster.error(message);
    return;
  }
  if (!this.subscribeForm.invalid) {
  let userCredentials = {
    email: data.email,
  };
      this.httpCategoryService
      .sendContactUS(userCredentials)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            const message ="You have successfully subscribed to the newsletter";
            this.toaster.success(message);
         this.subscribe=true;
  $('.offer_popup_container').css("visibility", "hidden")
  
          }
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }
}

}