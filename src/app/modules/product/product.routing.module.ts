import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductComponent } from "./product.component";
import { ProductResolver } from "../auth/auth-guard/product.resolver";

export const route: Routes = [
  {
    path: "",
    component: ProductComponent,
    resolve:{myProduct:ProductResolver}
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class ProductRoutingModule {}
