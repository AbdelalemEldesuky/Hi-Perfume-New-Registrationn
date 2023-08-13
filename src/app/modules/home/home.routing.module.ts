import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddressComponentComponent } from "./components/address-component/address-component.component";
import { AddressModalComponent } from "./components/address-modal/address-modal.component";
import { EditProfileDataComponent } from "./components/edit-profile-data-component/edit-profile-data.component";
import { HomeComponent } from "./home.component";
import { CanActivateCheckoutGuard } from "../auth/auth-guard/checkout.guard";
import { CanActivateViaAuthGuard } from "../auth/auth-guard/auth.guard";
import { AboutComponentComponent } from "./about/about.component";
import { TermsComponentComponent } from "./terms/terms.component";
import { ContactusComponentComponent } from "./contactus/contactus.component";
import { ShippingPolicyComponent } from "./shippingPolicy/shippingPolicy.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { ReferComponent } from "./refer/refer.component";

export const route: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "profile",
    component: EditProfileDataComponent,
    canActivate: [CanActivateViaAuthGuard],
  },
  {
    path: "refer",
    component: ReferComponent,
    canActivate: [CanActivateViaAuthGuard],
  },
  {
    path: "addAddress",
    component: AddressModalComponent
  },
  {
    path: "about",
    component: AboutComponentComponent
  },
  {
    path: "terms",
    component: TermsComponentComponent
  },
  {
    path: "shippingPolicy",
    component: ShippingPolicyComponent
  },
  {
    path: "privacyPolicy",
    component: PrivacyComponent
  },
  {
    path: "contactus",
    component: ContactusComponentComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class HomeRoutingModule {}
