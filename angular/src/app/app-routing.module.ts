
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardSaleComponent } from './dashboard-sale/dashboard-sale.component';
import { FormComponent } from './form/form.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { DashboardFilterComponent } from './dashboard-filter/dashboard-filter.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { SaleService } from './_services/sale.service';
import { HttpModule } from '@angular/http';


const routes: Routes = [
    {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full'
    },
    {
      path: 'main',
      component: MainPageComponent,
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'form',
      component: FormComponent
    },
    {
      path: 'dashboard',
      component: DashboardSaleComponent
    },
    {
      path:'dashboard/:make',
      component: DashboardFilterComponent
    },
    {
      path: 'detail/:id',
      component: SaleDetailComponent
    },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
