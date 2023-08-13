import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BestSellerComponent } from "./bestSeller.component";

export const route: Routes = [
  {
    path: "",
    component: BestSellerComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class BestSellerRoutingModule {}
