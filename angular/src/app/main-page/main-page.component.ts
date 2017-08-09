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
	contactUs = '';
	personName = '';
	subject = '';
	info = '';
	contactEmail ='';
	
	subscribe() {
	    this.subscribePost = 'You are subscribed';
	    console.log(this.email);
	    this.http
  		.post('/api/report/', {message:this.email, id:-1},)
  		.subscribe(result => 
  			{
  				console.log(result);
  			});
  		alert("Subscribed! Thank you for your support!");
	}

	send(){
		this.contactUs = 'Contact Admins';
	    console.log(this.email);
	    this.http
  		.post('/api/report/', {message:"Name: " + this.personName + " Email: " +this.contactEmail + " Subject: " + this.subject + " Message: " + this.info, id:-2},)
  		.subscribe(result => 
  			{
  				console.log(result);
  			});
		alert("We have received your feedback!");
	}

	facebook(){
		window.location.href = 'https://www.facebook.com';
	}

	instagram(){
		window.location.href = 'https://www.instagram.com';
	}
	snapchat(){
		window.location.href = 'https://www.snapchat.com';
	}

	pinterest(){
		window.location.href = 'https://www.pinterest.com';
	}
	twitter(){
		window.location.href = 'https://www.twitter.com';
	}

	linkedin(){
		window.location.href = 'https://www.linkedin.com';
	}

  
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }
}

