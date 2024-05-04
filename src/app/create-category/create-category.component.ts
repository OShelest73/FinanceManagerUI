import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateFinancialGoal } from '../interfaces/FinancialGoal';
import { Category } from '../interfaces/Category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styles: [
  ]
})
export class CreateCategoryComponent {
  constructor
  (
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      categoryName: ['', Validators.required]
    }
  );
  }

  get categoryName(): FormControl {
    return this.form.get('categoryName') as FormControl;
  }

 onSubmit() {
  
    if (this.form.valid) {
      const categoryName: string = this.categoryName.value

      this.categoryService.createCategory(categoryName).subscribe(
        response => {
          window.location.reload();
        },
        error => {
          console.error('Ошибка при создании:', error);
          this.toastr.error('Ошибка при создании категории');
        }
      );
    }
 }
}
