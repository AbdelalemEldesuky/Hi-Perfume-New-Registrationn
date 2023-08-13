import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserlayoutComponent } from "./core/userlayout/userlayout.component";
import { CanActivateViaAuthGuard } from "./modules/auth/auth-guard/auth.guard";
import { CanActivateCheckoutGuard } from "./modules/auth/auth-guard/checkout.guard";

export const routes: Routes = [
  {
    path: "",
    component: UserlayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./modules/home/home.module").then((m) => m.HomeModule),
        pathMatch: "full",
      },
      {
        path: "refer/:id",
        loadChildren: () =>
          import("./modules/home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "user",
        loadChildren: () =>
          import("./modules/home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "checkout",
        loadChildren: () =>
          import("./modules/checkout/checkout.module").then(
            (m) => m.CheckoutModule
          ),
        canActivate: [CanActivateCheckoutGuard],
      },
      {
        path: "reservation",
        loadChildren: () =>
          import("./modules/reservation/reservation.module").then(
            (m) => m.ReservationModule
          ),
      },
      {
        path: "pay",
        loadChildren: () =>
          import("./modules/payment-form/payment-form.module").then(
            (m) => m.PaymentModule
          ),
          canActivate: [CanActivateCheckoutGuard],
      },
      {
        path: "perfumes",
        loadChildren: () =>
          import("./modules/perfumes/perfumes.module").then((m) => m.PerfumesModule),
      },
      {
        path: "perfumes/:id",
        loadChildren: () =>
          import("./modules/perfumes/perfumes.module").then((m) => m.PerfumesModule),
      },
      {
        path: "stories",
        loadChildren: () =>
          import("./modules/stories/stories.module").then(
            (m) => m.StoriesModule
          ),
      },
      {
        path: "bestSeller",
        loadChildren: () =>
          import("./modules/bestSeller/bestSeller.module").then(
            (m) => m.BestSellerModule
          ),
      },
      {
        path: "ourServices",
        loadChildren: () =>
          import("./modules/ourServices/ourServices.module").then(
            (m) => m.OurServicesModule
          ),
      },
      // {
      //   path: "",
      //   loadChildren: () =>
      //     import("./modules/coming-soon/coming-soon.module").then(
      //       (m) => m.ComingSoonModule
      //     ),
      // },
      {
        path: "product/:id/:partner_id",
        loadChildren: () =>
          import("./modules/product/product.module").then(
            (m) => m.ProductModule
          )      },
      {
        path: "pickup",
        loadChildren: () =>
          import("./modules/pickup/pickup.module").then(
            (m) => m.PickupModule
          ),
      },
     
      {
        path: "cart",
        loadChildren: () =>
          import("./modules/cart/cart.module").then(
            (m) => m.CartModule
          ),
      },
      {
        path: "order-details/:id",
        loadChildren: () =>
          import("./modules/order-details/order-details.module").then(
            (m) => m.OrderDetailsModule
          ),
      },
      {
        path: "favorites",
        loadChildren: () =>
          import("./modules/favorites/favorites.module").then(
            (m) => m.FavoritesModule
          ),
      },
      {
        path: "gifts",
        loadChildren: () =>
          import("./modules/gifts/gifts.module").then(
            (m) => m.GiftstModule
          ),
      },
      {
        path: "auth",
        loadChildren: () =>
          import("./modules/auth/auth.module").then((m) => m.AuthModule),
        // canActivate: [CanActivateViaAuthGuard],
        canActivate: [CanActivateCheckoutGuard],

      },
    ],
  },
  {
    path: "pay-mob",
    loadChildren: () =>
      import("./modules/payment-form/payment-form.module").then(
        (m) => m.PaymentModule
      ),
  },

  // {
  //   path: "auth",
  //   loadChildren: "./modules/auth/auth.module#",
  //           loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  // }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
