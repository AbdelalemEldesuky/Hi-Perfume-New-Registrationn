import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OurServicesComponent } from "./ourServices.component";

export const route: Routes = [
  {
    path: "",
    component: OurServicesComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class OurServicesRoutingModule {}
