import { Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { FinancialGoalService } from '../services/financial-goal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Category } from '../interfaces/Category';
import { FinancialGoal, UpdateFinancialGoal } from '../interfaces/FinancialGoal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-goal',
  templateUrl: './update-goal.component.html',
  styles: [
  ]
})
export class UpdateGoalComponent {
  constructor
  (
    private categoryService: CategoryService,
    private goalService: FinancialGoalService, 
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  form!: FormGroup;
  goal!: FinancialGoal;
  categories: Category[] = [];
  goalId!: string;
  private goalSubscription!: Subscription;

  ngOnInit() {
    this.goalId = this.route.snapshot.params['id'];

  this.goalSubscription = this.goalService.getGoalDetailed(this.goalId, this.jwtService.getUserId())
    .subscribe(
      (goal: FinancialGoal) => {
        this.goal = goal;

        this.form = this.fb.group({
          moneyAmount: [this.goal.moneyAmount, [Validators.required, this.notZeroValidator()]],
          startDate: ['', Validators.required],
          dueDate: ['', Validators.required],
          categoryId: ['', Validators.required]
        });
      },
      error => {
        console.error('Ошибка при получении транзакции:', error);
      });

  this.categoryService.getCategories().subscribe(categories => {
    this.categories = categories;
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
    if (this.form.valid) {
      const startDate = new Date(this.startDate.value);
      const dueDate = new Date(this.dueDate.value);
  
      const startDateFormatted = this.formatDateTimeLocal(startDate);
      const dueDateFormatted = this.formatDateTimeLocal(dueDate);
  
      const financialGoal: UpdateFinancialGoal = {
        id: this.goalId,
        moneyAmount: this.moneyAmount.value,
        startDate: startDateFormatted,
        dueDate: dueDateFormatted,
        categoryId: this.categoryId.value,
        userId: Number(this.jwtService.getUserId())
      };
  
      this.goalService.updateGoal(financialGoal).subscribe(
        response => {
          this.router.navigate(['/goal/' + this.goalId]);
        },
        error => {
          console.error('Ошибка при изменении:', error);
          this.toastr.error('Ошибка при изменении цели');
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

  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}
