import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
	id: number;
  	private sub: any;
	subscribePost = '';
	email = '';
	
	subscribe() {
	    this.subscribePost = 'You are subscribed';
	    console.log(this.email);
	    this.http
  		.post('/api/report/', {message:this.email, id:9999999999},)
  		.subscribe(result => 
  			{
  				console.log(result);
  			});
  		alert("Subscribed! Thank you for your support!");
	}

  
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }
}

