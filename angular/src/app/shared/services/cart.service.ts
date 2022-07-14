import { Injectable } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product_id: number;
  product: Product;
  qty: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items: CartItem[] = [];

  constructor() {
    this.loadItems();
  }

  public get items() {
    return this._items;
  }

  public get count() {
    return this._items.length;
  }

  public loadItems() {
    let items = localStorage.getItem('cart_items');
    if (items) {
      this._items = JSON.parse(items) as Array<CartItem>;
    }
  }

  public saveItems() {
    let json = JSON.stringify(this._items);

    localStorage.setItem('cart_items', json);
  }

  public add(product: Product, qty: number = 1) {
    if (!this._items.find((item) => item.product_id == product.id)) {
      this._items.push({
        product_id: product.id,
        product: product,
        qty: qty,
      });
      this.saveItems();
    }
  }

  public remove(product: Product) {
    let idx = this._items.findIndex((item) => item.product_id == product.id);
    if (idx >= 0) {
      this._items.splice(idx, 1);
      this.saveItems();
    }
  }

  public increment(product: Product) {
    let idx = this._items.findIndex((item) => item.product_id == product.id);
    if (idx >= 0) {
      let qty = this._items[idx].qty;
      this._items[idx].qty = qty + 1;
      this.saveItems();
    }
  }

  public decrement(product: Product) {
    let idx = this._items.findIndex((item) => item.product_id == product.id);
    if (idx >= 0) {
      let qty = this._items[idx].qty;
      this._items[idx].qty = qty - 1;
      this.saveItems();
    }
  }

  public has(product: Product) {
    let idx = this._items.findIndex((item) => item.product_id == product.id);
    return idx >= 0;
  }

  public quantityOf(product: Product) {
    let idx = this._items.findIndex((item) => item.product_id == product.id);
    return idx >= 0 ? this._items[idx].qty : 0;
  }
}
