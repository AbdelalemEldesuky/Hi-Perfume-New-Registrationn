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
} from "@angular/core";

import { MatCarousel, MatCarouselComponent } from "@ngmodule/material-carousel";
import { UsersService } from "./services/users.service";
import { HttpResponse } from "@angular/common/http";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { fromEvent, Subject } from "rxjs";
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { OnDestroy, TemplateRef } from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as $ from 'jquery';
$('#elemId').width();
import { AuthService } from '../../modules/auth/service/auth.service';

import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import * as AOS from 'aos';
import { LanguageService } from "src/app/shared/services/language.service";
// import { AnyRecordWithTtl } from "dns";
import { NavigationEnd, NavigationStart } from '@angular/router';
import { HttpCartService } from "src/app/shared/services/cart.service";
import { LoginComponent } from "../auth/login/login.component";

export interface DialogData {
  animal: string;
  name: string;
}
const config: ModalOptions = {
  backdrop: "static",
  keyboard: false,
  animated: true,
  ignoreBackdropClick: true,
  initialState: {
    data1: "new-user",
    username: "test",
  },
  class: "pupUp-booking-modal",
};


type ShareData = { url: string; description: string; tags: string };
type ShareLinks = { title: string; link: string };


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy ,DoCheck{
  
  @ViewChild("modalone", { static: false }) public modalone: ModalDirective;
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild("rate", { static: true }) rate: TemplateRef<any>;
  @ViewChild('getAppTemplate', { static: true }) getAppTemplate;
  @ViewChild('loginTemplate', { static: true }) loginTemplate;
  @ViewChild('signupTemplate', { static: true }) signupTemplate;

  isShow = true;
  addBookingForm: FormGroup;
  menuState: String = 'out';
  services: any;
  users: any[];
  loading = true;
  unsubscribeSignal: Subject<void> = new Subject();
  stringifiedData: any;
    sliders: any[] = [];
  sName = false;
  sCnumber = false;
  sMnumber = false;
  currentLanguage: string;

  secondSectionPriceForm: FormGroup;
  charities: any = [];
  userData: any = [];
  modalRef: BsModalRef;
  modalRefs: BsModalRef[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: any;
  open: boolean = true;
  disabled: boolean = true;
  offer_popup: boolean = false;
  isFirstOpen = true;
  language: any = ''
  logoutState$ = this.authService.isLogoutState$;
  isLoggedOut$ = this.authService.isLogoutState$;
  token = this.authService.getToken();
  isLoggedIn = localStorage.getItem("isLogin");
  userStateLocalStorage: boolean;
  start_animation:boolean ;
  tagID :any;
  products: any[] = [];
  filteredCategories: any;
  item_name:any
  item_sub_name:any;
  item_image:any;
  name: string;
  cartDetails:any;
   element = document.querySelector('#scrollId');
  shareData: ShareData = {
    url: 'https://github.com/husseinAbdElaziz',
    description: 'dev',
    tags: 'hussein_AbdElaziz',
  };

  shareLinks = {
    link_fb: `https://www.facebook.com/sharer.php?u=${this.shareData.url}`
  };
    // {
    //   title: 'twitter',
    //   link: `https://twitter.com/intent/tweet?url=${this.shareData?.url}&text=${this.shareData?.description}&hashtags=${this.shareData?.tags}`,
    // },
    // {
    //   title: 'pinterest',
    //   link: `http://pinterest.com/pin/create/link/?url=${this.shareData?.url}`,
    // },
    // {
    //   title: 'whatsapp',
    //   link: `https://wa.me?text=${this.shareData?.url}`,
    // },
    // {
    //   title: 'send to 00201012345678',
    //   link: 'https://wa.me/+201012345678',
    // },
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private httpUsersService: UsersService,
    private httpCategoryService: HttpCategoryService,
    private httpCartService: HttpCartService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private title: Title,
    private modalService: BsModalService,
    private languageService: LanguageService,
    private router: Router,
    private route :ActivatedRoute,

    private elementRef: ElementRef,
     private renderer: Renderer2,
     
  ) {
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects
      ) {
        if(localStorage.getItem("firstVisit")){
          setTimeout(() => {
            this.offer_popup = true;
          }, 5000)
        }
      }
    })
    this.getSliders();
    // this.getTagIDFromApi("best seller")
    this.getProductsByCategory(32)
  }

  ngOnInit() {

    const partnerId = this.route.snapshot.params.id;
    if(partnerId){
    const userId = localStorage.getItem('userId');
    console.log(partnerId,'-----------',userId);
    if(userId !== partnerId && partnerId !=0){
      localStorage.setItem('partnerId',partnerId)
    }
  }
    // this.openModalAgreements(this.getAppTemplate) 
    if(!localStorage.getItem("firstVisit")){
      localStorage.setItem("firstVisit","true");
      this.openModal(this.getAppTemplate) 
    }

    // Check if the home page is being reloaded (navigationType 1: Reload)


    this.start_animation=true;
    
      $(".toggle").on("click", function() {
        console.log('%%%%%%%%%%%%%%%%%');
        $(".social-container").toggleClass("opened");
        
      })

    $(".slider").each(function () {
      var $this = $(this);
      var $group = $this.find(".slide_group");
      var $slides = $this.find(".slide");
      var bulletArray = [];
      var currentIndex = 0;
      var timeout;
    
      function move(newIndex) {
        var animateLeft, slideLeft;
    
        // advance();
    
        if ($group.is(":animated") || currentIndex === newIndex) {
          return;
        }
    
        bulletArray[currentIndex].removeClass("active");
        bulletArray[newIndex].addClass("active");
    
        if (newIndex > currentIndex) {
          slideLeft = "100%";
          animateLeft = "-100%";
          $('.previous_btn').removeClass('opacity_slider');

        } else {
          slideLeft = "-100%";
          animateLeft = "100%";
          $('.previous_btn').addClass('opacity_slider');

        }
    
        $slides.eq(newIndex).css({
          display: "block",
          left: slideLeft
        });
        $group.animate(
          {
            left: animateLeft
          },
          function () {
            $slides.eq(currentIndex).css({
              display: "none"
            });
            $slides.eq(newIndex).css({
              left: 0
            });
            $group.css({
              left: 0
            });
            currentIndex = newIndex;
          }
        );
      }
    
      function advance() {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          if (currentIndex < $slides.length - 1) {
            move(currentIndex + 1);
          } else {
            move(0);
          }
        }, 4000);
      }
    
      $(".next_btn").on("click", function () {
        if (currentIndex < $slides.length - 1) {
          move(currentIndex + 1);
        } else {
          move(0);
        }
      });
    
      $(".previous_btn").on("click", function () {
        if (currentIndex !== 0) {
          move(currentIndex - 1);
        } else {
          move(3);
        }
      });
    
      $.each($slides, function (index) {
        var $button = $('<a class="slide_btn">&bull;</a>');
    
        if (index === currentIndex) {
          $button.addClass("active");
        }
        $button
          .on("click", function () {
            move(index);
          })
          .appendTo(".slide_buttons");
        bulletArray.push($button);
      });
    
      // advance();
      
    });
    
    
    // this.getUserData();
    AOS.init();

    this.title.setTitle("Hi Perfume");
    this.userData=JSON.parse(localStorage.getItem("userData"))
    this.checkUserState();
    this.isShow = true;
        this.menuState = 'out';
    this.currentLanguage = localStorage.getItem("current-language");


    ///////////////////////////////

    
  }

  ngDoCheck(): void {
  //  console.log('home%%%%%');
   const modalStatus = localStorage.getItem('modalStatus')
   if(modalStatus=='close'){
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
    localStorage.removeItem('modalStatus')
  }

  // if(localStorage.getItem("notAuthUser")){
  //   localStorage.setItem('need_login','true')
  // this.router.navigateByUrl(
  //   `/auth/register`
  // );
  // }

  // if(localStorage.getItem("notAuthUserSignUp")){
  //   this.router.navigateByUrl(
  //     `/auth/register`
  //   );
  // }


  }

  facbookShare(id) {
    const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
    const url_= `https://hiperfumeusa.com/product/${id}/${userId}`
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

    shareOnWhatsapp(name: string, image: string, sub_name: string, id: string) {
      const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
      const url_=  `https://hiperfumeusa.com/product/${id}/${userId}`
      const url = `https://wa.me?text=${url_}`;
      window.open(url, '_blank');
    }

    shareOnInstagram(name: string, image: string, sub_name: string, id: string) {
      const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
      const url_=  `https://hiperfumeusa.com/product/${id}/${userId}`
      const url = `https://www.instagram.com/share/create/?url=${url_}&caption=${encodeURIComponent(sub_name)}`;
      window.open(url, '_blank');
    }
 
  startAnimationHotDeal(){
    if(this.start_animation==false){
      const element_remove = this.elementRef.nativeElement.querySelector('#hotDeal');
      this.renderer.removeClass(element_remove, 'hotDeal');
      const element_remove2 = this.elementRef.nativeElement.querySelector('#hotDeal_arrow_rotate');
      this.renderer.removeClass(element_remove2, 'hotDeal_arrow_rotate');
      const element_remove3 = this.elementRef.nativeElement.querySelector('#hotDeal_text_animate');
      this.renderer.removeClass(element_remove3, 'hotDeal_text_animate');
      
      const element = this.elementRef.nativeElement.querySelector('#hotDeal');
    this.renderer.addClass(element, 'hotDeal_back');
    const element2 = this.elementRef.nativeElement.querySelector('#hotDeal_arrow_rotate');
    this.renderer.addClass(element2, 'hotDeal_back_arrow_rotate');
    const element3 = this.elementRef.nativeElement.querySelector('#hotDeal_text_animate');
    this.renderer.addClass(element3, 'hotDeal_back_text_animate');
    this.start_animation = true;
    return;
    }
    if(this.start_animation==true){
      const element_remove = this.elementRef.nativeElement.querySelector('#hotDeal');
    this.renderer.removeClass(element_remove, 'hotDeal_back');
    const element_remove2 = this.elementRef.nativeElement.querySelector('#hotDeal_arrow_rotate');
    this.renderer.removeClass(element_remove2, 'hotDeal_back_arrow_rotate');
    const element_remove3 = this.elementRef.nativeElement.querySelector('#hotDeal_text_animate');
    this.renderer.removeClass(element_remove3, 'hotDeal_back_text_animate');

    const element = this.elementRef.nativeElement.querySelector('#hotDeal');
    this.renderer.addClass(element, 'hotDeal');
    const element2 = this.elementRef.nativeElement.querySelector('#hotDeal_arrow_rotate');
    this.renderer.addClass(element2, 'hotDeal_arrow_rotate');
    const element3 = this.elementRef.nativeElement.querySelector('#hotDeal_text_animate');
    this.renderer.addClass(element3, 'hotDeal_text_animate');
    this.start_animation = false;
    return;
    }
  }

  ngAfterViewInit() {

    // Preloader
    $(window).on('load', function() {
     if ($('#preloader').length) {
       $('#preloader').delay(100).fadeOut('slow', function() {
         $(this).remove();
       });
     }
   });
     // Smooth scroll for the navigation menu and links with .scrollto classes
   var scrolltoOffset = $('#header').outerHeight() - 2;
   $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
       var target = $(this.hash);
       if (target.length) {
         e.preventDefault();
 
         var scrollto = target.offset().top - scrolltoOffset;
         if ($(this).attr("href") == '#header') {
           scrollto = 0;
         }
 
         $('main, data').animate({
           scrollTop: scrollto
         }, 1500, 'easeInOutExpo');
 
         if ($(this).parents('.nav-menu, .mobile-nav').length) {
           $('.nav-menu .active, .mobile-nav .active').removeClass('active');
           $(this).closest('li').addClass('active');
         }
 
         if ($('data').hasClass('mobile-nav-active')) {
           $('data').removeClass('mobile-nav-active');
           $('.mobile-nav-toggle i').toggleClass('fa-bars fa-xmark');
           $('.mobile-nav-overly').fadeOut();
         }
         return false;
       }
     }
     
   });
 
       // Activate smooth scroll on page load with hash links
   $(document).ready(function() {
     if (window.location.hash) {
       var initial_nav = window.location.hash;
       if ($(initial_nav).length) {
         var scrollto = $(initial_nav).offset().top - scrolltoOffset;
         $('main, data').animate({
           scrollTop: scrollto
         }, 1500, 'easeInOutExpo');
       }
     }
   });


 
 
 
     $(window).scroll(function() {
       if ($(this).scrollTop() > 100) {
         $('#header').addClass('header-scrolled');
       } else {
         $('#header').removeClass('header-scrolled');
       }
     });
     if ($(window).scrollTop() > 100) {
       $('#header').addClass('header-scrolled');
     }
     
   // Back to top button
   $(window).scroll(function() {
     if ($(this).scrollTop() > 100) {
       $('.back-to-top').fadeIn('slow');
     } else {
       $('.back-to-top').fadeOut('slow');
     }
   });
 
   $('.back-to-top').click(function() {
     $('main, data').animate({
       scrollTop: 0
     }, 1500, 'easeInOutExpo');
     return false;
   });
        // Initiate venobox (lightbox feature used in portofilo)
      //   $(document).ready(function() {
      //    $('.venobox').venobox({
      //      'share': false
      //    });
      //  });
     
       // if(localStorage.getItem("homePage")=="true"){
       //   $(".headerComponent").css("display","none");
       // }
       // if(localStorage.getItem("homePage")=="false"){
       //   $(".headerComponent").css("display","block");
       // }
   
 }



  // ngAfterViewChecked() {
  //   if(localStorage.getItem("loading")==='false'){
  //     this.loading =false;
  //     console.log("###########",this.loading);

  //   }
  // }
  getUserData() {
    this.httpUsersService.getUserData().subscribe((res) => {
      this.userData = res.body.data;
    });
  }


  openDialog() {
    this.modalone.show();
  }
  log(event: boolean) {
    this.open=!this.open;
  }
  getSliders() {
    this.httpCategoryService
      .getSlidersFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.sliders = data.body.data;
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }
  rating(star) {
    this.selectedValue = star;
    // this.selectedValue.value.rate = star;
    this.addBookingForm.setValue({ rate: star, comment: "" });
    console.log("ffffff", this.addBookingForm);
    console.log("sss", this.selectedValue);
  }
  refreshComponent() {
    this.router.navigateByUrl('/perfumes', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }
  openModalRate(rate: TemplateRef<any>, serviceId) {
    this.modalRef = this.modalService.show(
      rate,
      Object.assign({}, { class: "pupUp-rate-modal" })
    );
    this.addBookingForm.clearValidators();
  }

  openCategory(serviceId) {
    // return this.router.navigateByUrl(`/services/${serviceId}`);
    return this.router.navigateByUrl(
      `/app-categories/${serviceId}`
    );
  }



  // closeModal() {
  //   this.modalRef.hide();
    
  // }
  closeModal() {
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
//     $('.modal-backdrop').hide();
// $('.modal').hide();
  }

  
  closeModalGetApp() {
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
    // const offer_popup = localStorage.getItem('offer_popup');
    // this.offer_popup = !offer_popup;
    // if (!offer_popup) {
    //   localStorage.setItem('offer_popup', 'true');
    // }   
    setTimeout(() => {
      this.offer_popup = true;
    }, 5000)

  }
  // openModal(template: TemplateRef<any>, id) {
  //   openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }
  openModal(MyModalComponent) {
    const config = {
      ignoreBackdropClick: true
    };
    $('.modal').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "visible")
        const modalRef = this.modalService.show(MyModalComponent,config);
    this.modalRefs.push(modalRef);
  }

  openModalAgreements(MyModalComponent) {
        const modalRef = this.modalService.show(MyModalComponent);
    this.modalRefs.push(modalRef);
  }
  //  sendMessage() {
  //   const params = {
  //     name: document.getElementById("name").value,
  //     email: document.getElementById("email").value,
  //     phone: document.getElementById("phone").value,
  //     message: document.getElementById("message").value,
  //   };
  
  //   if(!params.name) {
  //     let message = 'please enter your full name!';
  //     if(lang === 'ar') message = 'من فضلك ادخل اسمك الكامل!'
  //     Swal.fire({
  //       icon: "error",
  //       title: message,
  //       timer: 2000,
  //       showConfirmButton: false,
  //       timerProgressBar: true,
  //       didOpen: (toast) => {
  //         toast.addEventListener("mouseenter", Swal.stopTimer);
  //         toast.addEventListener("mouseleave", Swal.resumeTimer);
  //       },
  //     });
  //     return ;
  //   }
  
  //   if(!params.email) {
  //     let message = 'please enter your email!';
  //     if(lang === 'ar') message = 'من فضلك ادخل بريدك الالكترونى!'
  //     Swal.fire({
  //       icon: "error",
  //       title: message,
  //       timer: 2000,
  //       showConfirmButton: false,
  //       timerProgressBar: true,
  //       didOpen: (toast) => {
  //         toast.addEventListener("mouseenter", Swal.stopTimer);
  //         toast.addEventListener("mouseleave", Swal.resumeTimer);
  //       },
  //     });
  //     return ;
  //   }
  
  //   if(!params.phone) {
  //     let message = 'please enter your phone number!';
  //     if(lang === 'ar') message = 'الرجاء إدخال هاتفك المحمول!'
  //     Swal.fire({
  //       icon: "error",
  //       title: message,
  //       timer: 2000,
  //       showConfirmButton: false,
  //       timerProgressBar: true,
  //       didOpen: (toast) => {
  //         toast.addEventListener("mouseenter", Swal.stopTimer);
  //         toast.addEventListener("mouseleave", Swal.resumeTimer);
  //       },
  //     });
  //     return ;
  //   }
  
  //   if(!params.message) {
  //     let message = 'please enter your message!';
  //     if(lang === 'ar') message = 'الرجاء إدخال رسالتك!'
  //     Swal.fire({
  //       icon: "error",
  //       title: message,
  //       timer: 2000,
  //       showConfirmButton: false,
  //       timerProgressBar: true,
  //       didOpen: (toast) => {
  //         toast.addEventListener("mouseenter", Swal.stopTimer);
  //         toast.addEventListener("mouseleave", Swal.resumeTimer);
  //       },
  //     });
  //     return ;
  //   }
  
  //   if (params.name && params.email && params.phone && params.message) {
  //     var xhr = new XMLHttpRequest();
  //     xhr.open("POST", baseUrl + "contactUs", true);
  //     xhr.onreadystatechange = callback;
  //     xhr.setRequestHeader("Content-type", "application/json");
  //     xhr.send(JSON.stringify(params));
  //     function callback() {
  //       if (xhr.readyState == 4 && xhr.status == 200) {
  //         message = "your message sent successfully";
  //         if (lang === "ar") message = 'تم ارسال رسالتك بنجاح';
  //         document.getElementById("name").value = '';
  //         document.getElementById("email").value = '';
  //         document.getElementById("phone").value = '';
  //         document.getElementById("message").value = '';
  //         Swal.fire({
  //           icon: "success",
  //           title: message,
  //           timer: 2000,
  //           showConfirmButton: false,
  //           timerProgressBar: true,
  //           didOpen: (toast) => {
  //             toast.addEventListener("mouseenter", Swal.stopTimer);
  //             toast.addEventListener("mouseleave", Swal.resumeTimer);
  //           },
  //         });
  //         return;
  //       } else if (xhr.readyState !== 4 && xhr.status !== 200) {
  //         var response = JSON.parse(xhr.responseText);
  //         // alert(response.message);
  //         Swal.fire({
  //           icon: "error",
  //           title: response.message,
  //           timer: 2000,
  //           showConfirmButton: false,
  //           timerProgressBar: true,
  //           didOpen: (toast) => {
  //             toast.addEventListener("mouseenter", Swal.stopTimer);
  //             toast.addEventListener("mouseleave", Swal.resumeTimer);
  //           },
  //         });
  //       }
  //     }
  //   }
  // }
  openProductDetails(id: number): void {
    const userId = localStorage.getItem('userId');
     if(userId){
       this.router.navigateByUrl(
        `/product/${id}/${localStorage.getItem('userId')}`
      );
     }
     else{
       this.router.navigateByUrl(
         `/product/${id}/${0}`
       );
     }
 }
  filterCategories(catVame) {
    if (catVame) {
      this.filteredCategories = this.products.filter((category: any) =>
        category.category.name.toLowerCase().includes(catVame));
        console.log('filterrr',this.filteredCategories);
        
    } else {
      this.filteredCategories = this.products;
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
      
          this.tagID = data.body.data[0].id;  
          console.log('ttttBest Sele',this.tagID);
        if(this.tagID){
          this.getSelections() 
      }
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  getProductsByCategory(categoryId) {
    this.httpCategoryService
  .getProductsByCategoryFromApi(categoryId)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (data: any) => {
        this.products = data.data.items;
        console.log('sssss///best seller',this.products);
   
        
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
        console.log('sssss///best seller',this.products);
   
        
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}
  scrollToTop(){
    window.scroll(0,0);
  }
  checkUserState() {
    if (this.isLoggedIn === 'true') {
      this.userStateLocalStorage = true;
      return;
    }
    this.userStateLocalStorage = false;

  }
  switchLang() {
    const language = '';
    let changeLanguage = language === '' ? 'en' : 'ar';
    // this.languageService.changeAppLanguage(changeLanguage);
  }
  ngOnDestroy(){
  }
  loginRoute(){
    this.router.navigate([`/auth/login`]);

  }
  logOut() {
    this.authService.logout();
    this.refreshComponent()
  }
  logout() {
    this.authService.isLogoutSubject.next(true);
    this.authService.logout();
  }
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  refreshAPICart() {
    this.httpCategoryService.refresh();
  }
  addToCart(id,addToCartNotifyTemplate,name,image,sub_name) {
    if(localStorage.getItem("isLogin")==="false"){
      this.router.navigateByUrl(
        `/auth/register`
      );
      localStorage.setItem('need_login','true')
      localStorage.setItem('notAuthUser','true')
    }
      else{
    let cartData = {
      item_id: id,
      quantity: 1,
    };
    this.loading = true;
      this.httpCartService
        .addToCart(cartData)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {
              this.cartDetails = resp.body;
              this.item_name=name;
              this.item_sub_name=sub_name;
              this.item_image=image;
              //  this.openModal(addToCartNotifyTemplate)
              this.refreshAPICart()
            this.getSelections()

               this.toaster.success('Item added to cart');
            }
          },
          (err) => {
            this.loading = false;
            this.toaster.error(err.error.message);
          }
        );
  }
}

refreshFavorit() {
  this.httpCategoryService.refresh();
}



addFavorite(id) {
  if(localStorage.getItem("isLogin")==="false"){
    this.router.navigateByUrl(
      `/auth/register`
    );
    localStorage.setItem('need_login','true')
    localStorage.setItem('notAuthUser','true')

  }
    else{
  let cartData = {
    item_id: id,
  };
  this.loading = true;
    this.httpCartService
      .addFavorite(cartData)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.cartDetails = resp.body;
            this.getSelections()
            this.refreshFavorit()
            if(resp.body.data.is_added == true){
              this.toaster.success(resp.body.message);
            }
            if(resp.body.data.is_added == false){
              this.toaster.error(resp.body.message);
            }
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}}

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

}
