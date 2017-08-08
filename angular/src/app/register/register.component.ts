import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service'

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    error_messages: any = {};

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        if (!this.passwordMismatch()) {
            this.loading = true;
            delete this.model.confirm_password;
            this.userService.register(this.model)
                .subscribe(
                    data => {
                        this.alertService.success('Registration successful!', true);
                        this.router.navigate(['/login']);
                    },
                    error => {
                        this.error_messages = error.json();
                        this.loading = false;
                    });
        }
    }

    passwordMismatch() {
        return this.model.password != this.model.confirm_password;
    }

    notLoading() {
        return !this.loading;
    }
}
