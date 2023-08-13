import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer,
  OnChanges,
  HostListener,
  TemplateRef,
  ViewChild,
  DoCheck,
  AfterViewInit,
  AfterViewChecked,
} from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { AuthService } from "../../modules/auth/service/auth.service";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { Subject, Subscription } from "rxjs";
import { LanguageService } from "src/app/shared/services/language.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import * as $ from "jquery";
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options } from "@angular-slider/ngx-slider";

$("#elemId").width();
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d(0,0,0)",
        })
      ),
      state(
        "out",
        style({
          transform: "translate3d(100%, 0, 0)",
        })
      ),
      transition("in => out", animate("400ms ease-in-out")),
      transition("out => in", animate("400ms ease-in-out")),
    ]),
  ],
})
export class HeaderComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
  searchResultsFound = false;
  _opened: boolean = false;
  menuState: String = "out";
  logoutState$ = this.authService.isLogoutState$;
  userStateLocalStorage: boolean;
  products: any[] = [];
  isLoggedIn = localStorage.getItem("isLogin");
  subscription: Subscription;
  isShow = true;
  isFilterShow=true;
  isLoggedOut$ = this.authService.isLogoutState$;
  token = this.authService.getToken();
  userData: any = null;
  modalRef: BsModalRef;
  currentLanguage: any;
  language: any = ''
  showFilter=false;
  showPerfumeFilter=false;
  isActiveClass = false;
  noneActiveClass = true;
  activeItem = 0;
  categories: any = [];
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  tagName :any;
  tagID :any;
  filterPForm: FormGroup;
  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 1000
  };
  isClicked=true;
  isClicked2=false;
  productsFilter: any[] = [];
  
  constructor(
    public authService: AuthService,
    private router: Router,
    private el: ElementRef,
    private languageService: LanguageService,
    private utilityService: HttpCartService,
    private modalService: BsModalService,
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private fb: FormBuilder

  ) {}

  ngOnInit() {
    this.getCategories();
    this.filterPForm = this.fb.group({
      category: ['', Validators.required],
      price: [''],
      high: ['High to Low'],
      low: ['Low to High']
    });
    this.userData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null;
    this.checkUserState();
    this.isShow = true;
    this.menuState = "out";
    this.currentLanguage = localStorage.getItem("current-language");

     

  }



  ngAfterViewChecked() {}
  ngAfterViewInit() {
    // Preloader
    $(window).on("load", function () {
      if ($("#preloader").length) {
        $("#preloader")
          .delay(100)
          .fadeOut("slow", function () {
            $(this).remove();
          });
      }
    });
    // Smooth scroll for the navigation menu and links with .scrollto classes
    var scrolltoOffset = $("#header").outerHeight() - 2;
    $(document).on(
      "click",
      ".nav-menu a, .mobile-nav a, .scrollto",
      function (e) {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
          var target = $(this.hash);
          if (target.length) {
            e.preventDefault();

            var scrollto = target.offset().top - scrolltoOffset;
            if ($(this).attr("href") == "#header") {
              scrollto = 0;
            }

            $("main, data").animate(
              {
                scrollTop: scrollto,
              },
              1500,
              "easeInOutExpo"
            );

            if ($(this).parents(".nav-menu, .mobile-nav").length) {
              $(".nav-menu .active, .mobile-nav .active").removeClass("active");
              $(this).closest("li").addClass("active");
            }

            if ($("data").hasClass("mobile-nav-active")) {
              $("data").removeClass("mobile-nav-active");
              $(".mobile-nav-toggle i").toggleClass("fa-bars fa-xmark");
              $(".mobile-nav-overly").fadeOut();
            }
            return false;
          }
        }
      }
    );

    // Activate smooth scroll on page load with hash links
    $(document).ready(function () {
      if (window.location.hash) {
        var initial_nav = window.location.hash;
        if ($(initial_nav).length) {
          var scrollto = $(initial_nav).offset().top - scrolltoOffset;
          $("main, data").animate(
            {
              scrollTop: scrollto,
            },
            1500,
            "easeInOutExpo"
          );
        }
      }
    });
    // Mobile Navigation
    if ($(".nav-menu").length) {
      var $mobile_nav = $(".nav-menu").clone().prop({
        class: "mobile-nav d-lg-none",
      });
      $("data").append($mobile_nav);
      $("data").prepend(
        '<button type="button" (click)="togelNav()" class="mobile-nav-toggle d-lg-none"><i class="fa-solid fa-bars"></i></button>'
      );
      $("data").append('<div class="mobile-nav-overly"></div>');

      // $(document).on('click', '.mobile-nav-toggle', function(e) {
      $(".mobile-nav-toggle").click(function () {
        $("data").toggleClass("mobile-nav-active");
        $(".mobile-nav-toggle i").toggleClass("fa-bars fa-xmark");
        $(".mobile-nav-overly").toggle();
      });

      // $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      $(".mobile-nav .drop-down > a").click(function (e) {
        e.preventDefault();
        $(this).next().slideToggle(300);
        $(this).parent().toggleClass("active");
      });

      $(document).on("click", ".testOnclick", function (e) {
        e.preventDefault();
        console.log("sssssssssssssssssssssssssss");
      });

      $(document).click(function (e) {
        var container = $(".mobile-nav, .mobile-nav-toggle");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($("data").hasClass("mobile-nav-active")) {
            $("data").removeClass("mobile-nav-active");
            $(".mobile-nav-toggle i").toggleClass("fa-bars fa-xmark");
            $(".mobile-nav-overly").fadeOut();
          }
        }
      });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
      $(".mobile-nav, .mobile-nav-toggle").hide();
    }



    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $("#header").addClass("header-scrolled");
      } else {
        $("#header").removeClass("header-scrolled");
      }
    });
    if ($(window).scrollTop() > 100) {
      $("#header").addClass("header-scrolled");
    }

    // Back to top button
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $(".back-to-top").fadeIn("slow");
      } else {
        $(".back-to-top").fadeOut("slow");
      }
    });

    $(".back-to-top").click(function () {
      $("main, data").animate(
        {
          scrollTop: 0,
        },
        1500,
        "easeInOutExpo"
      );
      return false;
    });
    // Initiate venobox (lightbox feature used in portofilo)
    // $(document).ready(function () {
    //   $(".venobox").venobox({
    //     share: false,
    //   });
    // });

    // if(localStorage.getItem("homePage")=="true"){
    //   $(".headerComponent").css("display","none");
    // }
    // if(localStorage.getItem("homePage")=="false"){
    //   $(".headerComponent").css("display","block");
    // }
  }

  @HostListener("click", ["$event.target"])
  onClick(target) {
    let item = this.el.nativeElement.querySelector("li");
    this.utilityService.closeSideBarSubject.next(true);
  }

  switchLang() {
    console.log("ffffffffffff");

    const language = ''
    let changeLanguage = language === "" ? "" : "";
    // this.languageService.changeAppLanguage(changeLanguage);
  }

  logOut() {
    this.authService.logout();
    window.location.reload();
  }

  togelNav() {
    $("data").toggleClass("mobile-nav-active");
    $(".mobile-nav-toggle i").toggleClass("fa-bars fa-xmark");
    $(".mobile-nav-overly").toggle();
  }

  checkUserState() {
    if (this.isLoggedIn === "true") {
      this.userStateLocalStorage = true;
      return;
    }
    this.userStateLocalStorage = false;
  }

  toggleMenu() {
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === "out" ? "in" : "out";
    console.log("LLLL");
  }

  onClickedOutside(e: Event) {
    if (this.menuState === "in") {
      this.menuState = "out";
    }
  }

  logout() {
    this.authService.isLogoutSubject.next(true);
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.subscription ? this.subscription.unsubscribe() : 0;
  // }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  toggleFilterDisplay() {
    this.showPerfumeFilter = !this.showPerfumeFilter;
  }
  closeModal() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    const config = {
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config);
  }

  loginRoute() {
    this.router.navigate([
      `/auth/login`,
    ]);
  }

  openFilter(){
    this.showFilter=!this.showFilter;
  }
  // toggleClass() {
  //   this.isActiveClass =true;
  //   this.noneActiveClass =false;
  // }
  onSearch(value: string) {
    console.log(`Search value: ${value}`);
    this.getTagIDFromApi(value)
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
            localStorage.setItem('tagId',this.tagID);
          }
          else{
            this.tagID = ''
          }
          console.log('tttt',this.tagID);
            // this.getSelections() 
            this.searchResultsFound = true;
            this.searchInput.nativeElement.value = '';
        
            this.router.navigateByUrl('/user', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/perfumes']);
            });
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  getSelections() {
    this.httpCategoryService
      .getSelectionsFromApi(this.tagID)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.products = data.data.items;
          console.log('sssss///',this.products);
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

onSubmit(){
  const category = String(this.filterPForm.controls.category.value);
  const price = this.filterPForm.controls.price.value[1];
  const high = this.filterPForm.controls.high.touched;
  const low = this.filterPForm.controls.low.touched;
  console.log('dsdessssaqqwwww',category,price,high,low);
  console.log('dsdessssaqqwwww',this.filterPForm);
  // getProducts() {
    this.httpCategoryService
      .getProductsFilterFromApi(high,price,category)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.productsFilter = data.data.items;
          localStorage.setItem('prouductByFilter',JSON.stringify(this.productsFilter))
      console.log('##FFFFFFproducts',this.products)
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  // }

}

logInfromPage(){
  localStorage.setItem('need_login','true')
  this.router.navigateByUrl(
    `/auth/register`
  );
}

signUpfromPage(){
  this.router.navigateByUrl(
    `/auth/register`
  );
  // localStorage.setItem('notAuthUserSignUp','true')
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
        console.log('@!!!!!!!!!@@',this.categories);
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}

openOrderPage(){
  localStorage.setItem('openOrder','true')
}
opeEditProfilePage(){
  localStorage.setItem('editProfile','true')
}

openPerfumeFilter(){
  this.showPerfumeFilter=!this.showPerfumeFilter;
} 

choseRange(){
  this.isClicked = !this.isClicked;
  this.isClicked2 = !this.isClicked2;

}
choseRange2(){
  this.isClicked2 = !this.isClicked2;
  this.isClicked = !this.isClicked;

}

addActiveClass(id: string) {

  $('li').removeClass('active');
  $(`#${id}`).addClass('active');

}
}
