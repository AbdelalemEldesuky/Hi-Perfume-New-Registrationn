import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PickupComponent } from "./pickup.component";

export const route: Routes = [
  {
    path: "",
    component: PickupComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class PickupRoutingModule {}
