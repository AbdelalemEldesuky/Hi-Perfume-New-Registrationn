import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartRoutingModule } from "./cart.routing.module";
import { CartComponent } from "./cart.component";
import { SharedModule } from "src/app/shared/shared.module";
import {NgxStripeModule } from "ngx-stripe";
// import { PaymentModalComponent } from "./payment-modal/payment-modal.component";

@NgModule({
  imports: [CommonModule, CartRoutingModule,SharedModule,
    NgxStripeModule.forRoot('pk_test_51H5E6hGtXaZtwBYvCG39zAdFDeA8qFTa9bKWxDmOzyfY5NAiwS1smV7HCcWTqz3BDDaTECbNquIWOonGMS7cWERB00o5PFocr9')],
  declarations: [CartComponent]
})
export class CartModule {}
