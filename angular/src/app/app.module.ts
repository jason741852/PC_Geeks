import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { SaleService } from './sale.service';

import {RouterModule, Routes} from '@angular/router';

import { HttpModule } from '@angular/http';
// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormComponent } from './form/form.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { DashboardSaleComponent } from './dashboard-sale/dashboard-sale.component';

import { AppRoutingModule } from './app-routing.module';
import { DashboardFilterComponent } from './dashboard-filter/dashboard-filter.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainPageComponent,
    LoginPageComponent,
    SidebarComponent,
    FormComponent,
    SaleDetailComponent,
    DashboardSaleComponent,
    DashboardFilterComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  providers: [SaleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
