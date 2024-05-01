import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateFinancialGoal, FinancialGoal, FinancialGoalPreview, UpdateFinancialGoal } from '../interfaces/FinancialGoal';

@Injectable({
  providedIn: 'root'
})

export class FinancialGoalService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.apiBaseUrl;

  getGoals(userId: number): Observable<FinancialGoalPreview[]> {
    let params = new HttpParams().set('userId', userId.toString());

    return this.http.get<FinancialGoalPreview[]>(this.baseUrl + '/financialgoal', { params })
    .pipe(
      map(data => data)
    );
  }
  
  getGoalDetailed(goalId: string, userId: string): Observable<FinancialGoal> {
    let params = new HttpParams()
    .set('userId', userId)
    .set('goalId', goalId);

    return this.http.get<FinancialGoal>(this.baseUrl + '/financialgoal/get-detailed', { params })
    .pipe(
      map(data => data)
    );
  }

  createGoal(financialGoal: CreateFinancialGoal): Observable<any> {
    const body = {
      MoneyAmount: financialGoal.moneyAmount,
      StartDate: financialGoal.startDate,
      DueDate: financialGoal.dueDate,
      CategoryId: financialGoal.categoryId,
      UserId: financialGoal.userId
    };

    return this.http.post<any>(`${this.baseUrl}/financialgoal`, body).pipe(
      catchError(error => {
        console.error('Ошибка при создании кошелька:', error);
        return throwError(error);
      })
    );
 }

 updateGoal(financialGoal: UpdateFinancialGoal): Observable<any> {
  const body = {
    Id: financialGoal.id,
    MoneyAmount: financialGoal.moneyAmount,
    StartDate: financialGoal.startDate,
    DueDate: financialGoal.dueDate,
    CategoryId: financialGoal.categoryId,
    UserId: financialGoal.userId
  };

  return this.http.put<any>(`${this.baseUrl}/financialgoal`, body).pipe(
    catchError(error => {
      console.error('Ошибка при изменении цели:', error);
      return throwError(error);
    })
  );
}

 deleteGoal(goalId: string): Observable<any> {
  let params = new HttpParams()
  .set('goalId', goalId);

  return this.http.delete<any>(this.baseUrl + '/financialgoal', {params}).pipe(
    catchError(error => {
      console.error('Ошибка при удалении цели:', error);
      return throwError(error);
    })
  )
 }
}