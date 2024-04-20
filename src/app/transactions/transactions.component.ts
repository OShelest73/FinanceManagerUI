import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionPreview } from '../interfaces/Transaction';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: [
  ]
})
export class TransactionsComponent {
  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private jwtService: JwtService
  ){}

  transactions: TransactionPreview[] = [];
  private transactionSybscription!: Subscription;
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
  
  parseDateString(dateString: string): Date {
    const [time, dayMonthYear] = dateString.split(' ');
    const [day, month, year] = dayMonthYear.split('-');
    const [hours, minutes] = time.split(':');
  
    const formattedDateString = `${month}-${day}-${year} ${hours}:${minutes}`;
    return new Date(formattedDateString);
  }

  ngOnInit(): void {
    this.transactionSybscription = this.transactionService.getTransactions(Number(this.jwtService.getUserId()))
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
    if(this.transactionSybscription) {
      this.transactionSybscription.unsubscribe();
    }
  }
}
