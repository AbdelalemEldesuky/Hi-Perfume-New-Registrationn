import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import { UsersService } from "../../services/users.service";
import { map, tap } from "rxjs/operators";
import { MatCarousel, MatCarouselComponent } from "@ngmodule/material-carousel";
import { HttpHeaders, HttpResponse } from "@angular/common/http";

import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from "rxjs/operators";
import * as $ from 'jquery';
import { fromEvent, Subject } from "rxjs";
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { OnDestroy, TemplateRef } from "@angular/core";
import { from, Observable } from "rxjs";
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
import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AuthService } from "src/app/modules/auth/service/auth.service";
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { HttpCartService } from "src/app/shared/services/cart.service";
import { HttpOrderService } from "src/app/shared/services/order.service ";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


interface Country {
  shortName: string;
  name: string;
}

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
@Component({
  selector: "app-edit-profile-data",
  templateUrl: "./edit-profile-data.component.html",
  styleUrls: ["./edit-profile-data.component.scss"],

})
export class EditProfileDataComponent implements OnInit,AfterViewInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild('fileInput', { static: true }) el: ElementRef;
  // @ViewChild('myTabset' , { static: true }) tabset: TabsetComponent;
  @ViewChild('tabset'  , { static: false }) tabset: TabsetComponent;
  // disableSwitching: boolean;

  imageUrl : any = 'https://img.freepik.com/free-icon/user_318-159711.jpg';
  editFile: boolean = true;
  removeUpload: boolean = false;
  addUserForm: FormGroup;
  changeUserMobileForm: FormGroup;
  changeUserPasswordForm: FormGroup;
  activeTabId: string = 'overview';
  firstLoad: boolean = true;

  modalRef: BsModalRef;
  oneAtATime = true;
  userData: any;
  firstName: any;
  unsubscribeSignal: Subject<void> = new Subject();
  loading: boolean;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 3;
  location:any;
  orders: any[] = [];
  privacy_policy:any
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  countries: Country[];
  country_iso=CountryISO.UnitedStates
  states: string[];
  cities: string[];
imageFile:any
reloadPage=false
  country = new FormControl(null, [Validators.required]);
  state = new FormControl({ value: null, disabled: false }, [
    Validators.required,
  ]);
  city = new FormControl({ value: null, disabled: false }, [
    Validators.required,
  ]);
  constructor(
    private toaster: ToastrService,
    private modalService: BsModalService,
    private httpUsersService: UsersService,
    public breakpointObserver: BreakpointObserver,
    private fg: FormBuilder,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public authService: AuthService,
    private httpCategoryService: HttpCategoryService,

    private httpOrderService :HttpOrderService
    ) {
      this.countries = this.authService.getCountries();
    }
    registrationForm = this.fb.group({
      file: [null]
    })  
    ngOnInit() {
      // const firstTime = localStorage.getItem('key')
      // if(!firstTime){
      //  localStorage.setItem('key','loaded')
      //  location.reload()
      // }else {
      //   localStorage.removeItem('key') 
      // }

      // if(this.reloadPage==false){
      // window.location.reload();

      // }
      // window.location.reload();
      this.getTermConditionsFromApi('PRIVACY&POLICY')
      this.country.valueChanges.subscribe((country) => {
        this.state.reset();
        // this.state.disable();
          this.states = this.authService.getStatesByCountry(country);
          this.state.enable();
      });
  
      this.state.valueChanges.subscribe((state) => {
        this.city.reset();
        // this.city.disable();
          this.cities = this.authService.getCitiesByState(this.country.value, state);
          this.city.enable();
      });

      this.getProfile();
      this.getOrder();
      // this.refreshComponent()
   
    // this.userData=JSON.parse(localStorage.getItem("userData"))


    // this.firstName=this.userData.split(' ')[0];
    this.addUserForm = this.fg.group({
      first_name: [ "", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required],
      mobile: [""],       
      gender: ["", Validators.required],  
      dob: [""],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      country: this.country,
      state: this.state,
      city: this.city,
      zip_code: [""],
    });

    this.changeUserMobileForm = this.fg.group({
      phone: ["", Validators.required],
    });
    this.changeUserPasswordForm = this.fg.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      newPasswordConfirmation: ["", Validators.required],
    });
    $(document).ready(function() {
      $('.btn-1').click(function() {
        $('#myTabse a[href="#edit_profile"]').tab('show');
      });
    });

   
  }
  
  ngAfterViewInit() {

    if(localStorage.getItem('openOrder')=='true'){
      setTimeout(() => {
        this.goto(2)
      }, 1000);
       localStorage.removeItem('openOrder')
     }
     if(localStorage.getItem('editProfile')=='true'){
      setTimeout(() => {
        this.goto(1)
      }, 1000);
       localStorage.removeItem('editProfile')
     }
     if(localStorage.getItem('privicyPolicy')=='true'){
      setTimeout(() => {
        this.goto(3)
      }, 1000);
       localStorage.removeItem('privicyPolicy')
     }


  }

  getProfile() {
    this.httpUsersService.getProfile().subscribe((res) => {
      console.log('ddddddd',res);
      
      this.userData = res.data;
      this.imageUrl =  res.data.avatar?res.data.avatar:"";
      this.addUserForm.patchValue({
        first_name: this.userData.first_name,
        last_name: this.userData.last_name,
        email: this.userData.email,
        mobile: this.userData.mobile,
        gender: this.userData.detail.gender,
        dob: this.userData.detail.dob,
        password: this.userData.password,
        confirmPassword: this.userData.confirmPassword,
        country: this.userData.country,
        state: this.userData.state,
        city: this.userData.city,
        zip_code: this.userData.zip_code,
      });
      this.addUserForm.get('gender').patchValue(this.userData.detail.gender);
      this.addUserForm.get('country').patchValue(this.userData.country);
      this.addUserForm.get('state').patchValue(this.userData.state);
      this.addUserForm.get('city').patchValue(this.userData.city);
      // const CountryISO =this.userData.country_code;
      if(this.userData.country){
        this.country_iso=this.userData.country;
      }
    });
  }

  closeModal() {
    this.modalRef.hide();
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
          this.privacy_policy = data.body.data;          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}
  refreshComponent() {
    this.router.navigateByUrl('/perfumes', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/user/profile']);
    });
  }

  setUserData(respone) {
    this.authService.saveToken(respone.body.data.access_token);
    this.authService.saveUserData(respone.body.data);
    localStorage.setItem("isLogin", "true");
    this.authService.isLogoutSubject.next(true);
  }

  updateProfile() {
    console.log(this.addUserForm.value);
   
    if (!this.addUserForm.controls.first_name.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    if (!this.addUserForm.controls.last_name.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    if (!this.addUserForm.controls.email.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    if (!this.addUserForm.controls.gender.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    if (!this.addUserForm.controls.country.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    if (!this.addUserForm.controls.state.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    // if (!this.addUserForm.controls.city.value) {
    //   const message ="Please fill in all the required fields";
    //   this.toaster.error(message);
    //   return;
    // }
    if (!this.addUserForm.controls.zip_code.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    if (!this.addUserForm.controls.mobile.value) {
      const message ="Please fill in all the required fields";
      this.toaster.error(message);
      return;
    }
    
    else {
      this.updatePassword()
      const data = this.addUserForm.value;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('muToken')
      });
     const detail= {
        gender:data.gender,
        dob:data.dob
      }
      let body = {
        // name: data.first_name+' '+data.last_name,
        first_name :data.first_name,
        last_name :data.last_name,
        country: data.country,
        state: data.state,
        city: data.city,
        zip_code: data.zip_code,
        email: data.email,
        mobile: data.mobile.internationalNumber.replace(/[^+\d]+/g, ""),
        avatar: this.imageFile,
      };

 

      
      const formData = new FormData();
      
      for ( let key in body ) {
        formData.append(key, body[key]);
      }
      for ( let key in detail ) {
        formData.append(`detail{${key}}`, detail[key]);
      }
      this.httpUsersService
        .updateUser(formData)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              this.authService.saveUserId(res.body.data.id);
           
              const message = "Profile has been updated successfully!";
              this.toaster.success(message);
              this.authService.saveUserPhoneNumber(res.body.data.mobile);
              const is_activated =res.body.data.detail.is_activated
              
              if(is_activated=='no'){
                localStorage.setItem('userIsVerfied','false')
              }
              else{
                localStorage.setItem('userIsVerfied','true')
              }
              // this.refreshComponent()
              this.getProfile()
            }
          },
          (err) => {
            this.loading = false;
            console.log(err);
            this.toaster.error(err.error.message);
            // this.notifcationService.errorNotification(err.error.message);
          }
        );
    }
  }
  rating(star){
    this.selectedValue=star;
  }

  updatePassword() {
    if (this.addUserForm.controls.password.value) {
      const data = this.addUserForm.value;
      let body = {
        password: data.password,
        password_confirmation: data.password,
      };
      this.httpUsersService
        .updateUserPassword(body)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.status === 200) {
              const message = "Password has been changed successfully!";
             console.log(message);
            }
          },
          (err) => {
            this.loading = false;
            console.log(err);
            this.toaster.error(err.error.message);
          }
        );
    }
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
	}

  openModal(template: TemplateRef<any>) {
    const config = {
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config);
  }
  // this.modalRef.hide();

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
        console.log('imggg--',this.imageUrl);
        
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();     
      this.imageFile=file   
    }
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
    this.editFile = true;
    this.removeUpload = false;
    this.registrationForm.patchValue({
      file: [null]
    });
  }
  goto(id){
    console.log('1111111111',id)
    this.tabset.tabs[id].active = true;
  }
  // Submit Registration Form
  onSubmit() {
    if(!this.registrationForm.valid) {
      alert('Please fill all the required fields to create a super hero!')
      return false;
    } else {
      console.log(this.registrationForm.value)
    }
  }
  logOut() {
    this.authService.logout();
  }
  // openAccountProfile() {
  //   $('#myTab a[href="#edit_profile"]').tab('show');
  // }


  getOrder() {
    this.httpOrderService
      .allUserOrders()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (res: any) => {
          this.orders = res.data.orders;
          console.log('orders///',this.orders);
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

openOrderDetails(id: number): void {
  this.router.navigateByUrl(
   `/order-details/${id}`
 );
}
}
