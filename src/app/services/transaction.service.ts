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

  getTransactionDetailed(transactionId: string): Observable<Transaction> {
    let params = new HttpParams().set('transactionId', transactionId);

    return this.http.get<Transaction>(this.baseUrl + '/MoneyTransaction/detailed-transaction', { params })
    .pipe(
      map(data => data)
    );
  }

  getTransactions(userId: string): Observable<TransactionPreview[]> {
    let params = new HttpParams().set('userId', userId);

    return this.http.get<TransactionPreview[]>(this.baseUrl + '/MoneyTransaction', { params })
    .pipe(
      map(data => data)
    );
  }

  getGoalTransactions(userId: string, goalId: string, isIncome: string, startDate: string, dueDate: string):
   Observable<TransactionPreview[]> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('goalId', goalId)
      .set('isIncome', isIncome)
      .set('startDate', startDate)
      .set('dueDate', dueDate);

    return this.http.get<TransactionPreview[]>(this.baseUrl + '/MoneyTransaction/goal-transactions', { params })
    .pipe(
      map(data => data)
    );
  }

  createTransaction(moneyTransaction: CreateTransaction, userId: number): Observable<any> {
    const body = {
      Amount: moneyTransaction.amount,
      Comment: moneyTransaction.comment,
      CreatedAt: moneyTransaction.createdAt,
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

  DeleteTransaction(transactionId: string): Observable<any> {
    let params = new HttpParams().set('transactionId', transactionId);

    return this.http.delete<any>(this.baseUrl + '/MoneyTransaction', {params}).pipe(
      catchError(error => {
        console.error('Ошибка при удалении транзакции:', error);
        return throwError(error);
      })
    )
  }
}