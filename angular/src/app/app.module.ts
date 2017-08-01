import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { RouterModule, Routes } from '@angular/router';
import { SaleService } from './sale.service';
import { BaseRequestOptions, HttpModule, JsonpModule } from '@angular/http';
import { RatingModule } from 'ngx-rating';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service'
import { UserService } from './_services/user.service'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormComponent } from './form/form.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { DashboardSaleComponent } from './dashboard-sale/dashboard-sale.component';

import { AppRoutingModule } from './app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { ProfileComponent } from "./profile/profile.component";

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
    ProfileComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    //InMemoryWebApiModule.forRoot(InMemoryDataService),

  ],
  providers: [
    SaleService,
    AlertService,
    AuthenticationService,
    UserService,
    MockBackend,
    BaseRequestOptions

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }