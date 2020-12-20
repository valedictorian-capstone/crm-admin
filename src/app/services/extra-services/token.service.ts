import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenVM } from '@view-models';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    protected readonly socket: Socket,
  ) { }
  setToken(token: TokenVM) {
    localStorage.setItem(environment.token, JSON.stringify(token.accessToken));
    localStorage.setItem('fullname', JSON.stringify(token.fullname));
    localStorage.setItem('roles', JSON.stringify(token.roles));
    localStorage.setItem('expiresIn', JSON.stringify(token.expiresIn));
    localStorage.setItem('id', JSON.stringify(token.id));
    if (token.avatar) {
      localStorage.setItem('avatar', JSON.stringify(token.avatar));
    }
  }

  getToken() {
    return JSON.parse(localStorage.getItem(environment.token));
  }

  clearToken() {
    this.socket.removeAllListeners();
    const selectedPipeline = localStorage.getItem('selectedPipeline');
    localStorage.clear();
    if (selectedPipeline) {
      localStorage.setItem('selectedPipeline', selectedPipeline);
    }
  }
}
