import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import { PCPartsService } from '../../service/pcparts.service'
import { ReviewsService } from '../../service/reviews.service'


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  starsCount: number
  // reviewForm: FormGroup
  pcpart: Object
  reviewContent: string

  constructor(
    private formBuilder: FormBuilder,
    private pcpartsService: PCPartsService,
    private router: ActivatedRoute,
    private reviewsService: ReviewsService
  ) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      let id = params['pcpartId']
      this.pcpartsService.getPCPart(id).subscribe(pcpart => this.pcpart = pcpart)
    })
  }

  addReview() {
    console.log(this.starsCount)
    console.log(this.reviewContent)
    console.log(this.pcpart)

    this.reviewsService.addReview(this.starsCount, this.reviewContent, this.pcpart)
  }
}
