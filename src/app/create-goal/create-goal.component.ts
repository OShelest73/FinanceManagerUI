import { Component, OnInit } from '@angular/core';
import { FinancialGoalService } from '../services/financial-goal.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CreateFinancialGoal } from '../interfaces/FinancialGoal';
import { Category } from '../interfaces/Category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-create-goal',
  templateUrl: './create-goal.component.html',
  styles: [
  ]
})
export class CreateGoalComponent implements OnInit {
  constructor
  (
    private categoryService: CategoryService,
    private service: FinancialGoalService, 
    private router: Router,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  form!: FormGroup;
  categories: Category[] = [];

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
        this.categories = categories;
    });

    this.form = this.fb.group({
      moneyAmount: [0, [Validators.required, this.notZeroValidator()]],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  get moneyAmount(): FormControl {
    return this.form.get('moneyAmount') as FormControl;
  }

  get startDate(): FormControl {
    return this.form.get('startDate') as FormControl;
  }

  get dueDate(): FormControl {
    return this.form.get('dueDate') as FormControl;
  }

  get categoryId(): FormControl {
    return this.form.get('categoryId') as FormControl;
  }

 onSubmit() {

    const startDate = new Date(this.startDate.value);
    const dueDate = new Date(this.dueDate.value);

    if (this.form.valid) {
      const financialGoal: CreateFinancialGoal = {
        moneyAmount: this.moneyAmount.value,
        startDate: startDate.toISOString(),
        dueDate: dueDate.toISOString(),
        categoryId: this.categoryId.value,
        userId: this.jwtService.getUserId()
      };

      this.service.createGoal(financialGoal).subscribe(
        response => {
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Ошибка при создании:', error);
          this.toastr.error('Ошибка при создании цели');
        }
      );
    }
 }

  notZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
       if (control.value === 0) {
         return { 'notZero': true };
       }
       
       return null;
    };
   }
}
