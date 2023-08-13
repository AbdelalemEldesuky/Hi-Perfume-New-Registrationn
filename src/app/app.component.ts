import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './modules/auth/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { StarRatingComponent } from 'ng-starrating';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { TranslateService } from '@ngx-translate/core';
import { Title ,Meta} from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // ngx-ui-loader-configuration ={
  //   "bgsColor": "#ffcd00",
  //   "bgsOpacity": 1,
  //   "bgsPosition": "bottom-right",
  //   "bgsSize": 70,
  //   "bgsType": "circle",
  //   "blur": 15,
  //   "delay": 0,
  //   "fastFadeOut": true,
  //   "fgsColor": "#ffcd00",
  //   "fgsPosition": "center-center",
  //   "fgsSize": 70,
  //   "fgsType": "circle",
  //   "gap": 24,
  //   "logoPosition": "center-center",
  //   "logoSize": 120,
  //   "logoUrl": "",
  //   "masterLoaderId": "master",
  //   "overlayBorderRadius": "0",
  //   "overlayColor": "#37517e",
  //   "pbColor": "#ffcd00 ",
  //   "pbDirection": "ltr",
  //   "pbThickness": 3,
  //   "hasProgressBar": true,
  //   "text": "",
  //   "textColor": "#FFFFFF",
  //   "textPosition": "center-center",
  //   "maxTime": -1,
  //   "minTime": 300
  //   }
  title = 'trif';
  modalRef: BsModalRef;
  max = 10;
  rate = 0;
  isReadonly = false;
  rateMaxNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  unsubscribeSignal: Subject<void> = new Subject();
  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  property: any;
  radioItems: Array<number>;
  model = { rate: 1 };
  loading = false;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private toaster: ToastrService,
   private metaTagService:Meta,
   private titleService : Title,
   private ngxService: NgxUiLoaderService,
   private translate: TranslateService
  ) {

    if(!localStorage.getItem("isLogin")){
      localStorage.setItem("isLogin","false");
    }
  }
  ngOnInit() {
    
    
    this.router.events.pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
    ).subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });

    
  }

  



}
