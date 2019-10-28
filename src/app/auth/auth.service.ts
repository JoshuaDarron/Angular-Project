import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/user/';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private authSatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authSatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };

    return this.http
      .post(BACKEND_URL + '/signup', authData)
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          err => {
            this.authSatusListener.next(false);
          }
        );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };

    this.http
      .post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        if (token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.authSatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      err => {
        this.authSatusListener.next(false);
      }
      );
  }

  setAuthTimer(duration: number) {
    console.log('Settng Timere in duration: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authSatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authSatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.claerAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, experationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', experationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private claerAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
