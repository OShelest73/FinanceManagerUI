import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { JwtService } from '../services/jwt.service';
import { Category } from '../interfaces/Category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: [
  ]
})
export class CategoriesComponent {
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private jwtService: JwtService
  ){}

  categories: Category[] = [];
  private categorySubscription!: Subscription;
  showCreateComponent: boolean = false;
  showUpdateComponent: boolean = false;
  categoryId: string = '';

  toggleCreateCategoryComponent() {
    this.showCreateComponent = !this.showCreateComponent;
  }

  toggleUpdateCategoryComponent(categoryId: string) {
    this.categoryId = categoryId;
    this.showUpdateComponent = !this.showUpdateComponent;
  }

  onDelete(id: number) {
    this.categoryService.deleteCategory(id.toString()).subscribe(
      () => {
        window.location.reload();
      },
      error => {
        console.error('Ошибка при удалении категории:', error);
      }
    );
  }
  
  ngOnInit(): void {
    this.categorySubscription = this.categoryService.getCategories()
    .subscribe(
      (notifications: Category[]) => {
        this.categories = notifications;
      },
      error => {
        console.error('Ошибка при получении категорий:', error);
      }
    );
  }

  ngOnDestroy(){
    if(this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }
}
