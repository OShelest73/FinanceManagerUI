import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { JwtService } from '../services/jwt.service';
import { TransactionPreview } from '../interfaces/Transaction';
import { Subscription, switchMap } from 'rxjs';
import { FinancialGoalService } from '../services/financial-goal.service';
import { FinancialGoal } from '../interfaces/FinancialGoal';

@Component({
  selector: 'app-financial-goal',
  templateUrl: './financial-goal.component.html',
  styles: [
  ]
})
export class FinancialGoalComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private goalService: FinancialGoalService,
    private jwtService: JwtService
  ){}

  goalId!: string;
  goal!: FinancialGoal;
  transactions: TransactionPreview[] = [];
  private transactionSubscription!: Subscription;
  private goalSubscription!: Subscription;
  searchText = '';
  sortKey = '';
  sortAscending = true;

  sortTransactions(key: string) {
    if (this.sortKey === key) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortKey = key;
      this.sortAscending = true;
    }
  
    this.transactions.sort((a, b) => {
      let valueA, valueB;
  
      switch (key) {
        case 'amount':
          valueA = a.amount;
          valueB = b.amount;
          break;
        case 'createdAt':
          valueA = this.parseDateString(a.createdAt);
          valueB = this.parseDateString(b.createdAt);
          break;
        case 'category':
          valueA = a.category.categoryName;
          valueB = b.category.categoryName;
          break;
        default:
          return 0;
      }
  
      if (valueA < valueB) {
        return this.sortAscending ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getSortSymbol(key: string): string {
    if (this.sortKey === key) {
      return this.sortAscending ? '▲' : '▼';
    }
    return '';
  }
  
  parseDateString(dateString: string): Date {
    const [time, dayMonthYear] = dateString.split(' ');
    const [day, month, year] = dayMonthYear.split('-');
    const [hours, minutes] = time.split(':');
  
    const formattedDateString = `${month}-${day}-${year} ${hours}:${minutes}`;
    return new Date(formattedDateString);
  }

  ngOnInit(): void {
    this.goalId = this.route.snapshot.params['id'];
  
    this.goalSubscription = this.goalService.getGoalDetailed(this.goalId, this.jwtService.getUserId())
      .pipe(
        switchMap((goal: FinancialGoal) => {
          this.goal = goal;
          return this.transactionService.getGoalTransactions(
            this.jwtService.getUserId(), 
            this.goalId, String(this.goal.isIncome),
            this.parseDateString(String(this.goal.startDate)).toISOString(),
            this.parseDateString(String(this.goal.dueDate)).toISOString()
          )
        })
      )
      .subscribe(
        (transactions: TransactionPreview[]) => {
          this.transactions = transactions;
        },
        error => {
          console.error('Ошибка при получении транзакций:', error);
        }
      );
  }

  ngOnDestroy(){
    if(this.transactionSubscription) {
      this.transactionSubscription.unsubscribe();
    }
    if(this.goalSubscription) {
      this.goalSubscription.unsubscribe();
    }
  }

  onDelete() {
    this.goalService.deleteGoal(this.goalId).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Ошибка при удалении транзакции:', error);
      }
    );
  }
}
