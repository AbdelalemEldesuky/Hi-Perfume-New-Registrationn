import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ComingSoonComponent } from "./coming-soon.component";

export const route: Routes = [
  {
    path: "",
    component: ComingSoonComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class ComingSoonRoutingModule {}
