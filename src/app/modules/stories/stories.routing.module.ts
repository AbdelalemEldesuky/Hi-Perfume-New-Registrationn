import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StoriesComponent } from "./stories.component";

export const route: Routes = [
  {
    path: "",
    component: StoriesComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class StoriesRoutingModule {}
