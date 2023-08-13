import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home.routing.module";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SingleCategoryComponent } from "./components/single-category/single-category.component";
import { SingleHomeBannerComponent } from "./components/single-homeBanner/single-homeBanner.component";
import { SingleFeaturedPropertyComponent } from "./components/single-featuredProperty/single-featuredProperty.component";
import { ListCategoriesComponent } from "./components/list-categories/list-categories.component";
import { ListHomeBannersComponent } from "./components/list-homeBanners/list-homeBanners.component";
import { ListFeaturedPropertiesComponent } from "./components/list-featuredProperties/list-featuredProperties.component";
// import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatAccordion, MatDialogModule } from "@angular/material";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {  WavesModule } from 'angular-bootstrap-md'
// import { MatCarouselModule } from '@ngmodule/material-carousel'; 
// import { AddressComponentComponent } from "./components/address-component/address-component.component";
// import { ContinueOrderComponent } from "./components/continue-order/continue-order.component";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EditProfileDataComponent } from "./components/edit-profile-data-component/edit-profile-data.component";
import { SelectionComponentComponent } from "./selection/selection-component.component";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AboutComponentComponent } from "./about/about.component";
import { TermsComponentComponent } from "./terms/terms.component";
import { ContactusComponentComponent } from "./contactus/contactus.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShippingPolicyComponent } from "./shippingPolicy/shippingPolicy.component";
import { PrivacyComponent } from "./privacy/privacy.component";

@NgModule({
  imports: [
    CommonModule,
    WavesModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
    RouterModule,
    HomeRoutingModule,
    // MatCarouselModule.forRoot(),
    // MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [
    HomeComponent,
    EditProfileDataComponent,
    SingleCategoryComponent,
    AboutComponentComponent,
    TermsComponentComponent,
    ShippingPolicyComponent,
    PrivacyComponent,
    ContactusComponentComponent,
    ListCategoriesComponent,
    ListHomeBannersComponent,
    SingleHomeBannerComponent,
    ListFeaturedPropertiesComponent,
    SingleFeaturedPropertyComponent,
    SelectionComponentComponent,
    // ContinueOrderComponent,
    // AddressComponentComponent,
    // DialogOverviewExampleDialog,
  ],
  exports: [MatButtonModule, MatDialogModule,SharedModule,EditProfileDataComponent,MatAccordion,ShippingPolicyComponent,
    PrivacyComponent,],
  // entryComponents: [DialogOverviewExampleDialog],
  // providers: [DialogOverviewExampleDialog],
})
export class HomeModule {}
