import { Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NotificationService } from './popup-notification.service';

@Component({
  selector: 'app-popup-notification',
  templateUrl: './popup-notification.component.html',
  styleUrls: ['./popup-notification.component.scss']
})
export class PopupNotificationComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() sub_name: string;

  
  isLoggedIn = localStorage.getItem("isLogin");

  constructor(private notificationService: NotificationService) {}

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

viewCart() {
  // Emit the event with the necessary data
  this.notificationService.emitNotificationClicked({ image: this.image, name: this.name ,sub_name:this.sub_name});
}

closePopup(){
  this.notificationService.emitNotificationClicked({ image: this.image, name: this.name ,sub_name:this.sub_name});

}
}