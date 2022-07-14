import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SiteRoutingModule } from './site-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SiteComponent } from './components/site/site.component';
import { ProductComponent } from './components/product/product.component';
import { ProductListPageComponent } from './components/product-list-page/product-list-page.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProductListComponent,
    SearchResultsComponent,
    SiteComponent,
    ProductComponent,
    ProductListPageComponent,
    ProductSearchComponent,
  ],
  imports: [CommonModule, SharedModule, SiteRoutingModule],
  exports: [HomeComponent],
})
export class SiteModule {}
