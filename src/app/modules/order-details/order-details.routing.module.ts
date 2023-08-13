import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderDetailsComponent } from "./order-details.component";
import { CanActivateViaAuthGuard } from "../auth/auth-guard/auth.guard";

export const route: Routes = [
  {
    path: "",
    component: OrderDetailsComponent,
    canActivate: [CanActivateViaAuthGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class OrderDetailsRoutingModule {}
