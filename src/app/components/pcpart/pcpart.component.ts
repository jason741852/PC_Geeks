import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { PCPartsService } from '../../service/pcparts.service'
import { ReviewsService } from '../../service/reviews.service'
import { AuthenticationService } from '../../service/authentication.service'


@Component({
  selector: 'app-pcpart',
  templateUrl: './pcpart.component.html',
  styleUrls: ['./pcpart.component.css']
})
export class PCPartComponent implements OnInit {
  mostRecentPCParts: Array<any> = []

  pcpart: Object
  comments: Array<any>
  newComment: string

  constructor(
    private router: ActivatedRoute,
    private pcpartsService: PCPartsService,
    private auth: AuthenticationService,
    private reviewsService: ReviewsService
  ) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.mostRecentPCParts.push({'adult': 0, 'backdrop_path': "/puV2PFq4VQPItaygizgag8jrXa.jpg", 'genre_ids': 102, 'category': "Graphic Card", 'price': 225, 'id': 100, 'original_language': "en", 'original_title': "GTX 1060", 'overview': 'Perfect condition', 'popularity': 250.123363, 'poster_path':"https://images10.newegg.com/NeweggImage/ProductImage/14-487-267-S99.jpg", 'released_date': "2017-06-30", 'title':"Video card", 'video': false, 'vote_average': 6.2, 'vote_count': 543, '__photo__': Object});
      console.log(this.mostRecentPCParts);
    });
  }

  addComment() {
    // console.log('fired')
    let pcpartId = this.pcpart['id']
    this.reviewsService.addNewComment(this.newComment, pcpartId).subscribe(res => {
      this.loadContent(pcpartId)
      this.newComment = ''
    })

  }

  loadContent(id) {
    this.pcpartsService.getPCPart(id).subscribe(pcpart => this.pcpart = pcpart)
    this.reviewsService.getAllComments(id).subscribe(comments => {
      this.comments = comments
      console.log(this.comments)
      console.log(this.comments.length)
    })
  }

}
