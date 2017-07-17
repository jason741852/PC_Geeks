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
      let id = params['id']
      this.loadContent(id)
    })
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
