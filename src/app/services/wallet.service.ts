import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectWallet, Wallet } from '../interfaces/Wallet';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.apiBaseUrl;

  getWalletDetailed(walletId: string): Observable<Wallet> {
    let params = new HttpParams().set('walletId', walletId.toString());

    return this.http.get<Wallet>(this.baseUrl + '/wallet/get-detailed', { params })
    .pipe(
      map(data => data)
    );
  }

  getWallets(userId: number): Observable<Wallet[]> {
    let params = new HttpParams().set('userId', userId.toString());

    return this.http.get<Wallet[]>(this.baseUrl + '/wallet', { params })
    .pipe(
      map(data => data)
    );
  }

  getWalletsToSelect(userId: string): Observable<SelectWallet[]> {
    let params = new HttpParams().set('userId', userId);

    return this.http.get<SelectWallet[]>(this.baseUrl + '/wallet/select-wallet', { params })
    .pipe(
      map(data => data)
    );
  }

  createWallet(walletName: string, moneyAmount: number, userId: number): Observable<any> {
    const body = {
      WalletName: walletName,
      MoneyAmount: moneyAmount,
      UserId: userId
    };

    return this.http.post<any>(`${this.baseUrl}/wallet`, body).pipe(
      catchError(error => {
        console.error('Ошибка при создании кошелька:', error);
        return throwError(error);
      })
    );
  }

  updateWallet(wallet: Wallet, userId: string): Observable<any> {
    const body = {
      Id: wallet.id,
      WalletName: wallet.walletName,
      MoneyAmount: wallet.moneyAmount,
      UserId: userId
    };

    console.log(body);

    return this.http.put<any>(`${this.baseUrl}/wallet`, body).pipe(
      catchError(error => {
        console.error('Ошибка при обновлении кошелька:', error);
        return throwError(error);
      })
    );
  }

 deleteWallet(walletId: string): Observable<any> {
  let params = new HttpParams().set('walletId', walletId);

  return this.http.delete<any>(`${this.baseUrl}/wallet`, {params}).pipe(
    catchError(error => {
      console.error('Ошибка при удалении кошелька:', error);
      return throwError(error);
    })
  )
 }
 
}
