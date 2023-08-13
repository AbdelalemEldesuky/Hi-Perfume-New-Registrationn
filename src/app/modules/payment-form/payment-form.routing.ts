import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentFormComponent } from './payment-form.component';

export const route: Routes = [
  {
    path: "",
    component: PaymentFormComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class PaymentRoutingModule { }
