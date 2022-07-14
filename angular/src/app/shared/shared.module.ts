import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedInNavbarStatusComponent } from './components/logged-in-navbar-status/logged-in-navbar-status.component';
import { CartNavbarComponent } from './components/cart-navbar/cart-navbar.component';
import { CartCheckoutComponent } from './components/cart-checkout/cart-checkout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoggedInNavbarStatusComponent,
    CartNavbarComponent,
    CartCheckoutComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    LoggedInNavbarStatusComponent,
    CartCheckoutComponent,
    CartNavbarComponent,
  ],
})
export class SharedModule {}
