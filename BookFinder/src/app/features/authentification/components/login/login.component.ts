import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).then(() => {
      this.router.navigate(['/']);
    }).catch(() => {
      this.errorMessage = 'Invalid email or password';
    });
  }
}
