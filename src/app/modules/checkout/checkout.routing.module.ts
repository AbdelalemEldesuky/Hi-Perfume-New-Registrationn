import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CheckoutComponent } from './checkout.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';
import { CanActivePaymentStatus } from '../auth/auth-guard/payment-status.guard';
import { PaymentInvoiceComponent } from "../payment-form/payment-invoice/payment-invoice.component";

export const route: Routes = [
  {
    path: "complete-payment",
    component: CheckoutComponent
  },
  {
    path: "payment-status",
    component: PaymentStatusComponent,
  },
  {
    path: "invoice",
    component: PaymentInvoiceComponent,
  },
  
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class CheckoutRoutingModule { }
