import { Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AccessabilityService } from './popup-accessability.service';
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
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-popup-accessability',
  templateUrl: './popup-accessability.component.html',
  styleUrls: ['./popup-accessability.component.scss']
})
export class PopupAccessabilityComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() sub_name: string;

  
  isLoggedIn = localStorage.getItem("isLogin");
  unsubscribeSignal: Subject<void> = new Subject();
  loading: boolean = false;
  subscribe: boolean = false;
  accessability:any;
  show_accessability:any;
  constructor(private accessabilityService: AccessabilityService,
    private toaster: ToastrService,
    private fg: FormBuilder,
    private httpCategoryService: HttpCategoryService,

    ) {}

  public subscribeForm = this.fg.group({
    email: ["", Validators.required],
  });

  ngOnInit() {
    this.getTermConditionsFromApi('accessability')

    $(document).ready(function () {
      // jQuery extend functions for popup3
      (function ($) {
        $.fn.openPopup3 = function (settings) {
          var elem = $(this);
          // Establish our default settings
          var settings = $.extend(
            {
              anim: "fade"
            },
            settings
          );
          elem.show();
          elem.find(".popup3-content").addClass(settings.anim + "In");
        };
      
        $.fn.closePopup3 = function (settings) {
          var elem = $(this);
          // Establish our default settings
          var settings = $.extend(
            {
              anim: "fade"
            },
            settings
          );
          elem
            .find(".popup3-content")
            .removeClass(settings.anim + "In")
            .addClass(settings.anim + "Out");
      
          setTimeout(function () {
            elem.hide();
            elem.find(".popup3-content").removeClass(settings.anim + "Out");
          }, 500);
        };
      })($);
      
      // Click functions for popup3
      $(".open-popup3").click(function () {
        $("#" + $(this).data("id")).openPopup3({
          anim:
            !$(this).attr("data-animation") || $(this).data("animation") == null
              ? "fade"
              : $(this).data("animation")
        });
      });
      $(".close-popup3").click(function () {
        $("#" + $(this).data("id")).closePopup3({
          anim:
            !$(this).attr("data-animation") || $(this).data("animation") == null
              ? "fade"
              : $(this).data("animation")
        });
      });
        });
}


// closePopup3(){
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
  $('.offer_popup3_container').css("visibility", "hidden")
  
          }
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }
}

getTermConditionsFromApi(pageName) {
  this.httpCategoryService
    .getTermConditionsFromApi(pageName)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (data: any) => {
        this.accessability = data.body.data;       
           
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}
showAccessability(){
  this.show_accessability=true
}

toggleEpilepsySafeMode(event: MatSlideToggleChange) {
  const isChecked = event.checked;
  // Perform actions based on the toggle state
  if (isChecked) {
    $('main').addClass('epilepsy-safe-mode');
  //   const bodyTag = document.body;
  // bodyTag.classList.add('epilepsy-safe-mode');
  // this.renderer.addClass(document.body, 'epilepsy-safe-mode');
    console.log('Toggle is on');
  } else {
    $('main').removeClass('epilepsy-safe-mode');

  }
}

toggleHighContrastMode(event: MatSlideToggleChange) {
  const isChecked = event.checked;
  // Perform actions based on the toggle state
  if (isChecked) {
    $('main').addClass('accessability_HighContrastMod');
    $('a').addClass('accessability_HighContrastMod');
  //   const bodyTag = document.body;
  // bodyTag.classList.add('accessability_HighContrastMod');
  // this.renderer.addClass(document.body, 'accessability_HighContrastMod');
    console.log('Toggle is on');
  } else {
    $('main').removeClass('accessability_HighContrastMod');
    $('a').removeClass('accessability_HighContrastMod');


  }
}

}