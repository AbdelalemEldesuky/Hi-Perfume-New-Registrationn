import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocalizeRouterModule, LocalizeRouterSettings, ManualParserLoader, LocalizeParser } from 'localize-router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxUiLoaderModule } from "ngx-ui-loader";

import { AppComponent } from "./app.component";
import { RouterModule } from "@angular/router";
import { routes } from "./app.routing";
import { CoreModule } from './core/core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MyHttpInterceptor } from './core/interceptor/my-http-interceptor';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { Location } from "@angular/common";
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'ng-starrating';
// import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
// import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconsProviderModule } from './icons-provider.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import { NgxMaterialRatingModule } from 'ngx-material-rating';
// import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HttpClientModule } from '@angular/common/http';
// import { MatButtonModule } from "@angular/material/button";
import * as globlas from "../app/modules/auth/auth-guard/globlas";

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider
} from 'angularx-social-login';
import { SocialAuthService } from 'angularx-social-login';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxSeoModule } from '@avivharuzi/ngx-seo';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "./assets/locales/", ".json");
}


@NgModule({ 
  declarations: [AppComponent],
  imports: [
    NoopAnimationsModule,
    CoreModule,
    SocialLoginModule,
    NgxSeoModule.forRoot(),
    FormsModule,
    CarouselModule.forRoot(),
    NgxUiLoaderModule,
    RatingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    IconsProviderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    RouterModule.forRoot(routes),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },
    globlas.GetTokenNow,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '668553267026-s5k194p274820a6m7sfoj097qe5ljoes.apps.googleusercontent.com'
             
            ),
            
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
