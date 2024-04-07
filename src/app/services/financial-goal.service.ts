import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CreateFinancialGoal, FinancialGoalPreview } from '../interfaces/FinancialGoal';

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
}