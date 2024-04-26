import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/interfaces/Transaction';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styles: [
  ]
})
export class TransactionComponent {
  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router
  ){}

  transactionId!: string;
  transaction!: Transaction;
  private transactionSubscription!: Subscription;

  ngOnInit() {
    this.transactionId = this.route.snapshot.params['id'];

    this.transactionSubscription = this.transactionService.getTransactionDetailed(this.transactionId)
    .subscribe(
      (transaction: Transaction) => {
        this.transaction = transaction;
      },
      error => {
        console.error('Ошибка при получении транзакции:', error);
      }
    );
  }

  onDelete() {
    this.transactionService.DeleteTransaction(this.transactionId).subscribe(
      () => {
        this.router.navigate(['/transactions']);
      },
      error => {
        console.error('Ошибка при удалении транзакции:', error);
      }
    );
  }
}
