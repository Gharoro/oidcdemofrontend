import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit {
  loading: boolean = false;
  showToast = false;
  toastMessage = '';
  toastClass = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getAccessTokenFromUrl();
  }

  getAccessTokenFromUrl(): void {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');

    if (accessToken) {
      this.handleIamLogin(accessToken);
    }
  }

  handleIamLogin(token: string): void {
    this.loading = true;

    const apiUrl = 'https://oidcbackend.onrender.com/user/authenticate-iam';
    const payload = { access_token: token };

    const subscription = this.http
      .post<{ statusCode: number; message: string; data: { access_token: string } }>(apiUrl, payload)
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            localStorage.setItem('token', response.data.access_token);

            this.toastMessage = response.message;
            this.toastClass = 'alert alert-success';
            this.showToast = true;
            this.loading = false;
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Login failed:', response.message);
            this.toastMessage = response.message;
            this.toastClass = 'alert alert-danger';
            this.showToast = true;
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error during IAM login:', err);
          this.toastMessage = err.error.message;
          this.toastClass = 'alert alert-danger';
          this.showToast = true;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.showToast = false;
          this.toastMessage = '';
          this.toastClass = '';
          subscription.unsubscribe();
        }
      });
  }
}
