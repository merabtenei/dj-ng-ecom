import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SiteComponent } from './components/site/site.component';
import { ProductListPageComponent } from './components/product-list-page/product-list-page.component';
import { CartCheckoutComponent } from '../shared/components/cart-checkout/cart-checkout.component';

const routes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'product-list', component: ProductListPageComponent },
      { path: 'search', component: SearchResultsComponent },
      { path: 'cart-checkout', component: CartCheckoutComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteRoutingModule {}
