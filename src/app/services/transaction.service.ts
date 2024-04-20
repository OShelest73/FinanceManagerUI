import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CreateTransaction, Transaction, TransactionPreview } from '../interfaces/Transaction';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  baseUrl: string = environment.apiBaseUrl;

  getTransactions(userId: number): Observable<TransactionPreview[]> {
    let params = new HttpParams().set('userId', userId.toString());

    return this.http.get<TransactionPreview[]>(this.baseUrl + '/MoneyTransaction', { params })
    .pipe(
      map(data => data)
    );
  }

  createTransaction(moneyTransaction: CreateTransaction, userId: number): Observable<any> {
    const body = {
      Amount: moneyTransaction.amount,
      Comment: moneyTransaction.comment,
      WalletId: moneyTransaction.walletId,
      CategoryId: moneyTransaction.categoryId,
      UserId: userId
    };

    return this.http.post<any>(`${this.baseUrl}/moneytransaction`, body).pipe(
      catchError(error => {
        console.error('Ошибка при создании транзакции:', error);
        return throwError(error);
      })
    );
 }
}
