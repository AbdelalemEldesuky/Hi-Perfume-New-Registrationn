import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { CountdownTimerModule } from 'angular-countdown-timer';
import { SharedModule } from "src/app/shared/shared.module";
import { AuthComponent } from "./auth.component";
import { AuthRoutingModule } from "./auth.routing.module";
import { MatInputModule } from "@angular/material/input";
import {
  InputsModule,
  WavesModule,
  ButtonsModule,
  CollapseModule,
} from "angular-bootstrap-md";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginComponent } from "./login/login.component";
import { VerifyLoginComponent } from "./verify.login/verify.login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgetPasswordComponent } from "./forgetpassword/forgetpassword.component";
import { CdTimerModule } from "angular-cd-timer";
import { signuoOTPComponent } from "./signuoOTP/signuoOTP.component";
import { ResetPasswordComponent } from "./resetPassword/resetPassword.component";
// import { LoginComponent } from "./login/login.component";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    CdTimerModule,
    MatInputModule,
    InputsModule,
    WavesModule,
    ButtonsModule,
    CollapseModule,
    // CountdownTimerModule.forRoot(),
  ],
  declarations: [AuthComponent, LoginComponent, VerifyLoginComponent, SignupComponent,ForgetPasswordComponent,
    ResetPasswordComponent,
    signuoOTPComponent,
  ]
})
export class AuthModule {}
