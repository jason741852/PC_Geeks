
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { BaseRequestOptions, HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { RatingModule } from 'ngx-rating'
import { SlideMenuModule } from './slideMenuNavigation/slideMenu';
import { AppRoutingModule } from './app-routing.module';

import { SaleService } from './_services/sale.service';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service'
import { UserService } from './_services/user.service'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProfileComponent } from "./profile/profile.component";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormComponent } from './form/form.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { DashboardSaleComponent } from './dashboard-sale/dashboard-sale.component';
import { ListSaleComponent } from './list-sale/list-sale.component';

import { DashboardFilterComponent } from './dashboard-filter/dashboard-filter.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainPageComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    FormComponent,
    SaleDetailComponent,
    DashboardSaleComponent,
    ListSaleComponent,
    DashboardFilterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
    SlideMenuModule,
    ReactiveFormsModule
  ],
  providers: [
    SaleService,
    AlertService,
    AuthenticationService,
    UserService,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
