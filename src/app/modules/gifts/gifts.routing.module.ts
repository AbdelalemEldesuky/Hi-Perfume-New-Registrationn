import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GiftsComponent } from "./gifts.component";

export const route: Routes = [
  {
    path: "",
    component: GiftsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class GiftsRoutingModule {}
