import { Component, OnInit, OnDestroy, ViewChild, Input } from "@angular/core";
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { Subject, Subscription } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { cardAnimation } from "src/app/shared/animations/animation";
import { NgImageSliderComponent } from "ng-image-slider";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-continue-order",
  templateUrl: "./continue-order.component.html",
  styleUrls: ["./continue-order.component.scss"],
  animations: [cardAnimation],
})
export class ContinueOrderComponent implements OnInit, OnDestroy {
  @ViewChild("nav", { static: false }) slider: NgImageSliderComponent;
  ticks = Date.now().valueOf();
  loading = true;
  bestCities$: any = [];
  cities: any = [];
  unsubscribeSignal: Subject<void> = new Subject();
  currentLanguage: any = "";
  propertyTrans = {
    ar: "نشاط",
    en: "Property",
  };
  services: any = [];
  messageReceived: any;
  private subscriptionName: Subscription;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  isLogin: string;
  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentLanguage = localStorage.getItem("current-language");
    this.getUserCart();
  }

  completeOrder() {
    const language = localStorage.getItem("current-language");
    this.isLogin = localStorage.getItem("isLogin")
      ? localStorage.getItem("isLogin")
      : "false";
    if (localStorage.getItem("userId") && this.isLogin == "true") {
      this.router.navigate([
        `${localStorage.getItem(
          "LOCALIZE_DEFAULT_LANGUAGE"
        )}/create-order/firstStep`,
      ]);
    } else {
      const message =
        language === "en"
          ? "Login is required to complete the order "
          : "التسجيل مطلوب لاتمام الطلب";
      this.toaster.error(message);
      this.router.navigate([
        `/${localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE")}/auth/login`,
      ]);
      localStorage.setItem("RALOR", "/create-order/firstStep");
    }
  }

  getUserCart() {
    this.isLogin = localStorage.getItem("isLogin")
      ? localStorage.getItem("isLogin")
      : "false";
    if (localStorage.getItem("userId") && this.isLogin == "true") {
      const userId = localStorage.getItem("userId");
      this.httpCategoryService
        .getUserCart(userId)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (data: any) => {
            this.services = data.body.cart;
          },
          (err) => {
            this.toaster.error(err.error.message);
          }
        );
    } else {
      const userCart = localStorage.getItem("userCart")
        ? JSON.parse(localStorage.getItem("userCart"))
        : null;
      this.services = userCart && userCart.services ? userCart.services : [];
    }
  }

  deleteServiceFromCart(service) {
    this.isLogin = localStorage.getItem("isLogin")
      ? localStorage.getItem("isLogin")
      : "false";
    const userId = localStorage.getItem("userId");
    if (localStorage.getItem("userId") && this.isLogin == "true") {
      this.httpCategoryService
        .deleteServiceFromCart(userId, service._id)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (data: any) => {
            this.services = data.body.cart;
            this.ngOnInit();
            if (!this.services.length) {
              window.location.reload();
            }
          },
          (err) => {
            this.toaster.error(err.error.message);
          }
        );
    } else {
      const userCart = localStorage.getItem("userCart")
        ? JSON.parse(localStorage.getItem("userCart"))
        : null;
      const checkServiceIndex = userCart.services.findIndex(
        (s) => String(s.service._id) === String(service.service._id)
      );
      userCart.services.splice(checkServiceIndex, 1);
      localStorage.setItem("userCart", JSON.stringify(userCart));
      this.services = userCart.services;
      if (!this.services.length) {
        window.location.reload();
      }
    }
  }
  ngOnDestroy() {
    // It's a good practice to unsubscribe to ensure no memory leaks
    // this.subscriptionName.unsubscribe();
  }
}
