import { Component, Input } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../interfaces/Category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styles: [
  ]
})
export class UpdateCategoryComponent {
  constructor
  (
    private categoryService: CategoryService, 
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  @Input() categoryId: string = '';
  category!: Category;
  private categorySubscription!: Subscription;
  form!: FormGroup;

  ngOnInit(): void {
    this.categorySubscription = this.categoryService.getCategory(this.categoryId)
      .subscribe(
        (category: Category) => {
          this.category = category;
  
          this.form = new FormGroup({
            categoryName: new FormControl<string>(category.categoryName, Validators.required)
          });
  
          this.form.patchValue({
            categoryName: this.category.categoryName,
          });
  
          // Переместите этот код внутрь блока условия
          this.getCategoryNameControl();
        },
        error => {
          console.error('Ошибка при получении категории:', error);
        }
      );
  }
  
  // Перенесите этот метод внутрь компонента UpdateCategoryComponent
  getCategoryNameControl() {
    if (this.form) {
      return this.form.controls['categoryName'] as FormControl;
    }
    return null;
  }

  get categoryName(){
    return this.form.controls['categoryName'] as FormControl;
  }

  onSubmit(){
    const category: Category = {
      id: Number(this.categoryId),
      categoryName: this.categoryName.value
    };

    this.categoryService.updateCategory(category).subscribe(
      response => {
        window.location.reload();
      },
      error => {
         console.error('Ошибка при обновлении категории:', error);
         this.toastr.error(error.errorMessage, 'Ошибка при обновлении');
      }
     );
  }
}
