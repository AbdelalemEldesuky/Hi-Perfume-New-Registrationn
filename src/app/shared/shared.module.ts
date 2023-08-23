import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SearchComponent } from "./components/search/search.component";
import { NgxBoostrapModule } from "./ngx-bootstrap.module";
import { AddChaletsComponent } from "./components/add-chalets/add-chalets.component";
import { SidebarModule } from "ng-sidebar";
import { ClickOutsideModule } from "ng4-click-outside";
// import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ItemComponent } from "./components/item/item.component";
import { NguCarouselModule } from "@ngu/carousel";
// import { NgxGalleryModule } from "ngx-gallery";
import {NgxGalleryModule} from 'ngx-gallery-9';
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination"; // <-- import the module
import { SortComponent } from "./components/sort/sort.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { RateComponent } from "./components/rate/rate.component";
import { AgmCoreModule } from "@agm/core";
import { LayoutModule } from "@angular/cdk/layout";
import { NoItemsComponent } from "./components/no-items/no-items.component";
// import { LocalizeRouterModule } from "localize-router";
import { TranslateModule } from "@ngx-translate/core";

import { AngularSvgIconModule } from "angular-svg-icon";

import { ExtractTextPipe } from "src/app/shared/pipes/extractText";
import { ToastrModule } from "ngx-toastr";
import { CounterDirective } from "./directive/counter.directive";
import { PayNowButtonComponent } from "./components/pay-now-button/pay-now-button.component";
import { CustomButtonComponent } from "./components/cancel-btn/custom-btn.component";
import { TruncatePipe } from "./directive/truncate.pipe";
import { SaveBtnComponent } from "./save-btn/save-btn.component";
import { ConfirmLoginBtnComponent } from "./confirm-login-btn/confirm-login-btn.component";
import { ConfirmPaymentBtnComponent } from "./confirm-payment-btn/confirm-payment-btn.component";
import { NzIconModule, NzIconService } from "ng-zorro-antd/icon";
import { NzConfigService } from "ng-zorro-antd/core/config";
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxStarsModule } from 'ngx-stars';
import { ContinueOrderComponent } from "../modules/home/components/continue-order/continue-order.component";
import { AddressComponentComponent } from "../modules/home/components/address-component/address-component.component";
// import { CreateOrderComponent } from "../modules/createorder/createorder.component";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { EditProfileDataComponent } from "../modules/home/components/edit-profile-data-component/edit-profile-data.component";
import {
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import { HeaderComponent } from "../core/header/header.component";
import { FooterComponent } from "../core/footer/footer.component";
import { AddressModalComponent } from "../modules/home/components/address-modal/address-modal.component";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { FooterWhiteComponent } from "../core/footer_white/footer_white.component";
// import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from "../core/filter/filter.component";
import { BecomePartnersComponent } from "../core/become-ppartners/become-ppartners.component";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PaymentModalComponent } from "../modules/cart/payment-modal/payment-modal.component";
import { IvyCarouselModule } from "angular-responsive-carousel";
import { BestSellerComponent } from "../modules/bestSeller/bestSeller.component";
import { ConvertPipe } from "../modules/payment-form/convert.pipe";
import { PopupNotificationComponent } from "../shared/components/popup-notification/popup-notification.component";
import { BestSellerHomeComponent } from "../modules/home/best-seller-home/best-seller-home.component";
import { PopupOfferComponent } from "./components/popup-offer/popup-offer.component";
import { PaymentInvoiceComponent } from "../modules/payment-form/payment-invoice/payment-invoice.component";
import { ReferComponent } from "../modules/home/refer/refer.component";

// import { ShareButtonsModule } from 'ngx-sharebuttons';




// import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
// import { ShareButtonsModule } from 'ngx---buttons';

// import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
  imports: [
    CommonModule,
    // NgbCollapseModule,
        RouterModule,
    // ShareButtonsModule,
    // ShareIconsModule,
    NgxIntlTelInputModule,
    Ng2PageScrollModule,
    NgxUiLoaderModule,
    // BrowserAnimationsModule,
    AccordionModule.forRoot(),
    FormsModule,
    IvyCarouselModule,
    NgxStarsModule,
    ReactiveFormsModule,
    NgxBoostrapModule,
    ClickOutsideModule,
    NguCarouselModule,
    NgxGalleryModule,
    NgxSliderModule,
    NgSelectModule,
    NgxPaginationModule,
    MatButtonModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    BsDropdownModule.forRoot(),
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAkw1T9k76AWWJu5abETv2sdMwH_ms0hRI",
      libraries: ["places", "drawing", "geometry"],
    }),
    ToastrModule.forRoot(),
    AngularSvgIconModule,
    LayoutModule,
    TranslateModule,
    // LocalizeRouterModule,
    NzIconModule,
    NgImageSliderModule,
    // NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
  ],
  exports: [
    ReactiveFormsModule,
    HeaderComponent,
    PopupNotificationComponent,
    BestSellerComponent,
    FilterComponent,
    BestSellerHomeComponent,
    PaymentInvoiceComponent,
    ReferComponent,
    PopupOfferComponent,
    FooterComponent,
    // NgbCollapseModule,
    IvyCarouselModule,
    NgxStarsModule,
    PaymentModalComponent,
    NgxIntlTelInputModule,
    FooterWhiteComponent,
    ExtractTextPipe,
    ConvertPipe,
    // ShareButtonsModule,
    // ShareIconsModule,
    Ng2PageScrollModule,
    NgxBoostrapModule,
    RouterModule,
    // BrowserAnimationsModule,
    AccordionModule,
    ClickOutsideModule,
    NguCarouselModule,
    NgxGalleryModule,
    NgSelectModule,
    NgxPaginationModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    // CreateOrderComponent,
    FormsModule,
    AgmCoreModule,
    SaveBtnComponent,
    SearchComponent,
    AddChaletsComponent,
    ConfirmLoginBtnComponent,
    ConfirmPaymentBtnComponent,
    CustomButtonComponent,
    CounterDirective,
    SortComponent,
    SidebarModule,
    ItemComponent,
    LoaderComponent,
    NoItemsComponent,
    PayNowButtonComponent,
    AddressComponentComponent,
    // EditProfileDataComponent,
    ContinueOrderComponent,
    RateComponent,
    LayoutModule,
    TranslateModule,
    // LocalizeRouterModule,
    AngularSvgIconModule,
    ToastrModule,
    NzIconModule,
    NgImageSliderModule,
    AddressModalComponent,
    NgxUiLoaderModule,
    // NgxSkeletonLoaderModule,
  ],
  declarations: [
    HeaderComponent,
    PaymentModalComponent,
    FooterComponent,
    FooterWhiteComponent,
    PopupNotificationComponent,
    BestSellerComponent,
    SearchComponent,
    PaymentInvoiceComponent,
    AddChaletsComponent,
    CustomButtonComponent,
    ReferComponent,
    BestSellerHomeComponent,
    AddressComponentComponent,
    PopupOfferComponent,
    FilterComponent,
    BecomePartnersComponent,
    ExtractTextPipe,
    ConvertPipe,
    // EditProfileDataComponent,
    ContinueOrderComponent,
    AddressModalComponent,
    ItemComponent,
    SortComponent,
    LoaderComponent,
    RateComponent,
    ConfirmLoginBtnComponent,
    // CreateOrderComponent,
    ConfirmPaymentBtnComponent,
    NoItemsComponent,
    CounterDirective,
    PayNowButtonComponent,
    TruncatePipe,
    SaveBtnComponent,
  ],
  providers: [
    DatePipe,
    NzIconService,
    NzConfigService,
  
  ],
})
export class SharedModule {}
