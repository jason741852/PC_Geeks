import { Component, OnInit } from '@angular/core';

import { PCPartsService } from '../../service/pcparts.service'
import { AuthenticationService } from '../../service/authentication.service'

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mostRecentPCParts: Array<any>

  constructor(private pcpartsService: PCPartsService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.pcpartsService.getLatestPCParts()
      .subscribe(res => {
        this.mostRecentPCParts = res.slice(0, 12)
        console.log(this.mostRecentPCParts)
      })
  }
}
