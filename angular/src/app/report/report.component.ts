import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
	id: number;
  	private sub: any;
	submitReport = '';
	reason = '';
	
	submit() {
	    this.submitReport = 'Report Sent';
	    console.log(this.reason);
	    this.http
  		.post('/api/report/', {message:this.reason, id:this.id},)
  		.subscribe(result => 
  			{
  				console.log(result);
  			});
  		this.router.navigate(['./dashboard']);
	}

  
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
    this.id = +params['id']; // (+) converts string 'id' to a number
    console.log(this.id);
  	});
  }
}
