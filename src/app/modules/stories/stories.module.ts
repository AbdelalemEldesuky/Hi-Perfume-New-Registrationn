import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {StoriesRoutingModule } from "./stories.routing.module";
import {StoriesComponent } from "./stories.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [CommonModule,StoriesRoutingModule,SharedModule],
  declarations: [StoriesComponent]
})
export class StoriesModule {

}
