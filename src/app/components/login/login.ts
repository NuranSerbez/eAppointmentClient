import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { Http } from '../../services/http';
import { LoginResponseModel } from '../../models/login-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  login: LoginModel = new LoginModel();

  @ViewChild('password') password: ElementRef<HTMLInputElement> | undefined;
  isPasswordVisible: any;

  constructor(
    private http: Http,
    private router: Router,
  ) {}

  showOrHidePassword() {
    if (this.password === undefined) return;

    this.password.nativeElement.type =
      this.password.nativeElement.type === 'password' ? 'text' : 'password';
  }

  signIn(loginForm: NgForm) {
    if (loginForm.valid) {
      this.http.post<LoginResponseModel>('Auth/Login', this.login, (res) => {
        localStorage.setItem('token', res.data!.token);
        this.router.navigateByUrl('/');
      });
    }
  }
}
