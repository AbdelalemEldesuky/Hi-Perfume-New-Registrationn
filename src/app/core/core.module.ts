import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from '../app.routing';
import { UserlayoutComponent } from './userlayout/userlayout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { ClickOutsideModule } from 'ng4-click-outside';
import { RouterModule } from '@angular/router';
import { NgxBoostrapModule } from '../shared/ngx-bootstrap.module';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import { MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatIconModule } from "@angular/material";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { BecomePartnersComponent } from "./become-ppartners/become-ppartners.component";
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    NgxNavbarModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    ClickOutsideModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [UserlayoutComponent, SidebarComponent,SidenavComponent],
  exports: [ ClickOutsideModule, SharedModule,SidenavComponent]
})
export class CoreModule { }
