import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart-navbar',
  templateUrl: './cart-navbar.component.html',
  styleUrls: ['./cart-navbar.component.scss'],
})
export class CartNavbarComponent implements OnInit {
  constructor(public cartService: CartService) {}

  ngOnInit(): void {}
}
