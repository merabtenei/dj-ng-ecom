import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './components/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [DashboardComponent, AdminComponent],
  imports: [CommonModule, SharedModule, AdminRoutingModule],
})
export class AdminModule {}
