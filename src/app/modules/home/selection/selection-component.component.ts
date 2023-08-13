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
  ViewEncapsulation,
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
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from "src/app/shared/components/popup-notification/popup-notification.service";

interface Slide_ {
  name: string;
  backgroundColor: string;
}

@Component({
  selector: "app-selection-component",
  templateUrl: "./selection-component.component.html",
  styleUrls: ["./selection-component.component.scss"],

})
export class SelectionComponentComponent implements OnInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  @ViewChild('myTabset', { static: false }) myTabset: ElementRef;

  selections: any[] = [];
  selections2: any[] = [1,2,3,4,5,6,7,8,6,5,4,3];
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  tagName :any;
  tagID :any;
  cartDetails:any;
  stars: number[] = [1, 2, 3, 4, 5];
  bgTabColor:any;
 
  slide_s = [
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'},
    {image: 'https://pbs.twimg.com/profile_images/1588253271797514245/LFh7bt3u_400x400.jpg'}
  ];

  tabIsActive=false
  woman_sec_tab=false;
  men_sec_tab=false;
  unisex_sec_tab=false;
  item_name:any
  item_sub_name:any;
  item_image:any;
  itemIsAdded=false;
  is_added=false;
  catId:any;
  userIsVerfied = localStorage.getItem("userIsVerfied");
  isLoggedIn = localStorage.getItem("isLogin");
  constructor(
    private httpCategoryService: HttpCategoryService,
    private httpCartService: HttpCartService,
    private toaster: ToastrService,
    private router: Router,
    private renderer: Renderer2,
    private modalService: BsModalService,
    private dialog: MatDialog,
    private notificationService: NotificationService

    // public dialogRef: MatDialogRef<MyDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any


  ) {
    
  }

  ngOnInit() {

    this.notificationService.notificationClicked$.subscribe(data => {
      // Handle the popup notification click event
      // console.log('Popup notification clicked:', data);
      this.refreshAPICart()
      this.getProductsByCategory(this.catId)
      // Perform any desired actions with the data
    });

    // this.getTagIDFromApi("Men")
    this.getProductsByCategory(35)




    $(".slide_r").each(function () {
      var $this = $(this);
      var $group = $this.find(".slide__group");
      var $slide_s = $this.find(".slide_");
      var bulletArray = [];
      var currentIndex = 0;
      var timeout;
    
      function move(newIndex) {
        var animateLeft, slide_Left;
    
        // advance();
    
        if ($group.is(":animated") || currentIndex === newIndex) {
          return;
        }
    
        bulletArray[currentIndex].removeClass("active");
        bulletArray[newIndex].addClass("active");
    
        if (newIndex > currentIndex) {
          slide_Left = "100%";
          animateLeft = "-100%";
        } else {
          slide_Left = "-100%";
          animateLeft = "100%";
        }
    
        $slide_s.eq(newIndex).css({
          display: "block",
          left: slide_Left
        });
        $group.animate(
          {
            left: animateLeft
          },
          function () {
            $slide_s.eq(currentIndex).css({
              display: "none"
            });
            $slide_s.eq(newIndex).css({
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
          if (currentIndex < $slide_s.length - 1) {
            move(currentIndex + 1);
          } else {
            move(0);
          }
        }, 4000);
      }
    
      $(".next_btn_").on("click", function () {
        if (currentIndex < $slide_s.length - 1) {
          move(currentIndex + 1);
        } else {
          move(0);
        }
      });
    
      $(".previous_btn_").on("click", function () {
        if (currentIndex !== 0) {
          move(currentIndex - 1);
        } else {
          move(3);
        }
      });
    
      $.each($slide_s, function (index) {
        var $button = $('<a class="slide__btn">&bull;</a>');
    
        if (index === currentIndex) {
          $button.addClass("active");
        }
        $button
          .on("click", function () {
            move(index);
          })
          .appendTo(".slide__buttons");
        bulletArray.push($button);
      });
    
      // advance();
      
    });
    
  }
  
  // changeColor() {
  //   const tabsetElement = this.myTabset.nativeElement;
  //   if (tabsetElement.classList.contains('active')) {
  //     this.renderer.removeClass(tabsetElement, 'active');
  //     this.renderer.addClass(tabsetElement, 'woman_sec');
  //   } else {
  //     this.renderer.removeClass(tabsetElement, 'active');
  //     this.renderer.addClass(tabsetElement, 'woman_sec');
  //   }
  // }
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
          console.log('tttt',this.tagID);
          if(this.tagID){
            this.getSelections() 
        }
          
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
          this.selections = data.data.items;
          console.log('sssss///selection',this.selections);
     
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

openDialog(MyDialogComponent) {
  const dialogRef = this.dialog.open(MyDialogComponent, {
    width: '250px',
    data: { name: 'John', age: 30 }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

getProductsByCategory(categoryId) {
  // this.selections=[];
  if(categoryId==33){
    this.unisex_sec_tab=true
    this.woman_sec_tab=false
    this.men_sec_tab=true
  }
  if(categoryId==34){
    this.woman_sec_tab=true
    this.unisex_sec_tab=false
    this.men_sec_tab=false
  }
  if(categoryId==35){
    this.men_sec_tab=true
    this.woman_sec_tab=false
    this.unisex_sec_tab=false
  }
  this.httpCategoryService
  .getProductsByCategoryFromApi(categoryId)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (data: any) => {
        this.selections = data.data.items;
        console.log('sssss///selection',this.selections);
   
        
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}

onTabSelect(tab: TabDirective) {
  console.log('Tab selected:', tab.heading);
  // Add your logic here
}

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

refreshAPICart() {
  this.httpCategoryService.refresh();
}
openModal(MyModalComponent) {
  const config = {
    ignoreBackdropClick: true
  };
  const modalRef = this.modalService.show(MyModalComponent,config);
this.modalRefs.push(modalRef);
}

addToCart(selection,id,addToCartNotifyTemplate,name,image,sub_name,catId) {
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
            this.itemIsAdded=true;
            selection.showPopup = true;
            this.catId=catId;
            //  this.openModal(addToCartNotifyTemplate)
            // this.refreshAPICart()
            // this.getProductsByCategory(catId)

             this.toaster.success('Item added to cart');
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}}

refreshFavorit() {
  this.httpCategoryService.refresh();
}

addFavorite(id,categoryId) {
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
            this.getProductsByCategory(categoryId)
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
}
