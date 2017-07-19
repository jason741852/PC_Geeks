import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { AuthenticationService } from '../../app/service/authentication.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      username: this.formBuilder.control(null, Validators.required),
      password: this.formBuilder.control(null, Validators.required),
      confirmPassword: this.formBuilder.control(null, Validators.required)
    }, { validator: this.arePasswordsMatching('password', 'confirmPassword') });
  }

  resetForm() {
    this.buildForm();
  }

  arePasswordsMatching(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[password];
      let passwordConfirmationInput = group.controls[confirmPassword];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }

  onSubmit() {
    let username = this.registerForm.controls['username'].value
    let password = this.registerForm.controls['password'].value
    let confirmPassword = this.registerForm.controls['confirmPassword'].value

    this.registerForm.controls['confirmPassword'].hasError('reqired')

    this.authenticationService.register(username, password)
  }

}
