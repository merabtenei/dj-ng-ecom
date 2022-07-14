import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ViewsetRestApiService } from 'src/app/shared/services/viewset-rest-api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @Input() featured: boolean = false;
  @Input() discounted: boolean = false;
  @Input() page?: number;
  @Input() per_page?: number;
  products: Product[] = [];
  constructor(private restApi: ViewsetRestApiService) {}

  fetch() {
    let view = 'product';
    if (this.featured) view = 'product/featured';
    if (this.discounted) view = 'product/discounted';
    this.restApi
      .list<Product>(view, this.page, this.per_page)
      .subscribe((data) => {
        this.products = data.results;
      });
  }

  ngOnInit(): void {
    this.fetch();
  }
}
