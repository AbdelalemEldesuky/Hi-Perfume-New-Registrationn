import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ForgetPasswordComponent } from './forgetpassword/forgetpassword.component';
import { VerifyLoginComponent } from './verify.login/verify.login.component';
import { ResetPasswordComponent } from './resetPassword/resetPassword.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { signuoOTPComponent } from './signuoOTP/signuoOTP.component';

export const AuthRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgetpassword',
    component: ForgetPasswordComponent,
  },
  {
    path: 'register',
    component: SignupComponent,
  },
  {
    path: 'verify-code',
    component: VerifyLoginComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'verify',
    component: signuoOTPComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(AuthRoutes),
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }