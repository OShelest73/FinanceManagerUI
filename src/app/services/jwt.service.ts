import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class JwtService {

  private jwtHelper: JwtHelperService;

  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  public getToken() : string | null {
    return localStorage.getItem('token');
  }

  public decodeToken(): any {
    var token = this.getToken();
    if (token != null){
      return this.jwtHelper.decodeToken(token);
    }
  }

  public getUserId(): number {
    const decodedToken = this.decodeToken();
    return decodedToken['userId'];
  }

  public getClaim(claimKey: string): any {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken[claimKey] : null;
  }
}
