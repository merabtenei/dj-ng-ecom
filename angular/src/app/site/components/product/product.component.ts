import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input() product!: Product;
  @Input() size: string = 'sm';

  constructor(public cartService: CartService) {}

  ngOnInit(): void {}
}
