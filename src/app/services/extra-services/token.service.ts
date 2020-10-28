import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  setToken(token: string, userName: string): void {
    localStorage.setItem(environment.token, JSON.stringify(token));
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem(environment.token));
  }

  clearToken(): void {
    localStorage.clear();
  }
}
