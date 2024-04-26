import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { Wallet } from '../interfaces/Wallet';
import { Subscription } from 'rxjs';

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
    private router: Router
  ){}

  transactionId!: string;
  wallet!: Wallet;
  private walletSubscription!: Subscription;

  ngOnInit() {
    this.transactionId = this.route.snapshot.params['id'];

    this.walletSubscription = this.walletService.
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
