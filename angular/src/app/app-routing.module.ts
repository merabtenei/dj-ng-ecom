import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./site/site-routing.module').then((m) => m.SiteRoutingModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./admin/admin-routing.module').then((m) => m.AdminRoutingModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth-routing.module').then((m) => m.AuthRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
