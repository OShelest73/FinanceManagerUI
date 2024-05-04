import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Category } from '../interfaces/Category';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.apiBaseUrl;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl + '/category')
  }

  getCategory(id: string): Observable<Category> {
    let params = new HttpParams().set('id', id);

    return this.http.get<Category>(this.baseUrl + '/category/detailed', { params })
    .pipe(
      map(data => data)
    );
  }

  createCategory(categoryName: string): Observable<any> {

    return this.http.post<any>(this.baseUrl + '/category', { categoryName })
    .pipe(
      catchError(error => {
        console.error('Ошибка при создании категории:', error);
        return throwError(error);
      })
    );
  }

  updateCategory(category: Category): Observable<any> {
    const body = {
      Id: category.id,
      CategoryName: category.categoryName
    };

    return this.http.put<any>(this.baseUrl + '/category', body)
    .pipe(
      catchError(error => {
        console.error('Ошибка при обновлении категории:', error);
        return throwError(error);
      })
    );
  }

  deleteCategory(id: string): Observable<any> {
    let params = new HttpParams()
    .set('id', id);

    return this.http.delete<any>(this.baseUrl + '/category', {params})
    .pipe(
      catchError(error => {
        console.error('Ошибка при удалении категории:', error);
        return throwError(error);
      })
    );
  }
}
