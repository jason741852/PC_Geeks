import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { AuthenticationService } from '../../../service/authentication.service'

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control(null, Validators.required),
      password: this.formBuilder.control(null, Validators.required)
    });
  }

  resetForm() {
    this.buildForm();
  }

  onSubmit() {
    let username = this.loginForm.controls['username'].value
    let password = this.loginForm.controls['password'].value

    this.authenticationService.login(username, password)
  }
}
