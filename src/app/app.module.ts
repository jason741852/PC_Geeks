import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { RatingModule } from 'ngx-rating'

import {routing} from './app.routing'
import {AuthenticationService } from './service/authentication.service'
import {PCPartsService } from './service/pcparts.service'
import {ReviewsService } from './service/reviews.service'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PCPartComponent } from './components/pcpart/pcpart.component';
import { ReviewComponent } from './components/review/review.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PCPartComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    ReactiveFormsModule,
    RatingModule
  ],
  providers: [
    AuthenticationService,
    PCPartsService,
    ReviewsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
