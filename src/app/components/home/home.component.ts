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

  mostRecentPCParts: Array<any> = []

  constructor(private pcpartsService: PCPartsService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.pcpartsService.getLatestPCParts()
      .subscribe(res => {
        this.mostRecentPCParts.push({ 'adult': 0, 'backdrop_path': "/puV2PFq4VQPItaygizgag8jrXa.jpg", 'genre_ids': 102, 'id': 324852, 'original_language': "en", 'original_title': "GTX 1060", 'overview': 'Perfect condition', 'popularity': 250.123363, 'poster_path':"https://images10.newegg.com/NeweggImage/ProductImage/14-487-267-S99.jpg", 'released_date': "2017-06-30", 'title':"Video card", 'video': false, 'vote_average': 6.2, 'vote_count': 543, '__photo__': Object});
        console.log(this.mostRecentPCParts);
      });
  }
}
