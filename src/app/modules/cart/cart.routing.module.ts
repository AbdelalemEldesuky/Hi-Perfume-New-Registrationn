import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CartComponent } from "./cart.component";
import { CanActivateViaAuthGuard } from "../auth/auth-guard/auth.guard";

export const route: Routes = [
  {
    path: "",
    component: CartComponent,
    canActivate: [CanActivateViaAuthGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class CartRoutingModule {}
