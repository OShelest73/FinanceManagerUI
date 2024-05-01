import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { Wallet } from '../interfaces/Wallet';
import { Subscription, switchMap } from 'rxjs';
import { TransactionPreview } from '../interfaces/Transaction';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styles: [
  ]
})
export class WalletComponent {
  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private router: Router
  ){}

  walletId!: string;
  wallet!: Wallet;
  transactions: TransactionPreview[] = [];
  private walletSubscription!: Subscription;
  private transactionSubscription!: Subscription;
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

  ngOnInit() {
    this.walletId = this.route.snapshot.params['id'];

    this.walletSubscription = this.walletService.getWalletDetailed(this.walletId)
    .subscribe(
      (wallet: Wallet) => {
          this.wallet = wallet;
        },
        error => {
          console.error('Ошибка при получении кошелька:', error);
        }
      )

    this.transactionSubscription = this.transactionService.getWalletTransactions(this.walletId)
    .subscribe(
      (transactions: TransactionPreview[]) => {
        this.transactions = transactions;
      },
      error => {
        console.error('Ошибка при получении транзакций:', error);
      }
    )
  }

  onDelete() {
    this.walletService.deleteWallet(this.walletId).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Ошибка при удалении кошелька:', error);
      }
    );
  }
}
