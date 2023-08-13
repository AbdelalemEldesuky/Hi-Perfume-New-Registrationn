import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';

@NgModule({
  imports: [CommonModule, CheckoutRoutingModule, SharedModule],
  declarations: [CheckoutComponent, PaymentStatusComponent]
})
export class CheckoutModule { }
