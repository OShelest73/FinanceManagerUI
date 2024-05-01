import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/interfaces/Category';
import { CreateTransaction, Transaction, UpdateTransaction } from 'src/app/interfaces/Transaction';
import { SelectWallet } from 'src/app/interfaces/Wallet';
import { CategoryService } from 'src/app/services/category.service';
import { JwtService } from 'src/app/services/jwt.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-update-transaction',
  templateUrl: './update-transaction.component.html',
  styles: [
  ]
})
export class UpdateTransactionComponent {
  constructor
  (
    private categoryService: CategoryService,
    private walletService: WalletService,
    private transactionService: TransactionService, 
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  form!: FormGroup;
  transaction!: Transaction;
  private transactionSubscription!: Subscription;
  categories: Category[] = [];
  wallets: SelectWallet[] = [];
  transactionId!: string;

  ngOnInit() {
    this.transactionId = this.route.snapshot.params['id'];

    this.transactionSubscription = this.transactionService.getTransactionDetailed(this.transactionId)
    .subscribe(
    (transaction: Transaction) => {
      this.transaction = transaction;
      this.form = this.fb.group({
        moneyAmount: [null, [this.notZeroValidator()]],
        comment: [this.transaction.comment],
        createdAt: [this.transaction.createdAt],
        walletId: ['', Validators.required],
        categoryId: ['', Validators.required]
      });
      
      this.form.patchValue({
        moneyAmount: this.transaction.amount
      });
    },
    error => {
      console.error('Ошибка при получении транзакции:', error);
    }
  );

    this.categoryService.getCategories().subscribe(categories => {
        this.categories = categories;
    });

    this.walletService.getWalletsToSelect(this.jwtService.getUserId()).subscribe(wallets => {
      this.wallets = wallets;
    });
  }

  get moneyAmount(): FormControl {
    return this.form.get('moneyAmount') as FormControl;
  }

  get comment(): FormControl {
    return this.form.get('comment') as FormControl;
  }

  get createdAt(): FormControl {
    return this.form.get('createdAt') as FormControl;
  }

  get walletId(): FormControl {
    return this.form.get('walletId') as FormControl;
  }

  get categoryId(): FormControl {
    return this.form.get('categoryId') as FormControl;
  }

  onSubmit() {
    let createdAt = null;
    if (this.createdAt.value) {
      createdAt = new Date(this.createdAt.value);
      if (isNaN(createdAt.getTime())) {
        createdAt = null;
      }
    }

    if (this.form.valid) {
      const moneyTransaction: UpdateTransaction = {
        id: this.transactionId,
        amount: this.moneyAmount.value,
        comment: this.comment.value,
        createdAt: createdAt !== null ? createdAt.toISOString() : null,
        categoryId: this.categoryId.value,
        walletId: this.walletId.value
      };

      this.transactionService.updateTransaction(moneyTransaction, this.jwtService.getUserId()).subscribe(
        response => {
          this.router.navigate(['/transaction/' + this.transactionId]);
        },
        error => {
          console.error('Ошибка при создании:', error);
          this.toastr.error('Ошибка при создании транзакции');
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
