import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/interfaces/Category';
import { CreateTransaction } from 'src/app/interfaces/Transaction';
import { SelectWallet, Wallet } from 'src/app/interfaces/Wallet';
import { CategoryService } from 'src/app/services/category.service';
import { JwtService } from 'src/app/services/jwt.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styles: [
  ]
})
export class CreateTransactionComponent {
  constructor
  (
    private categoryService: CategoryService,
    private walletService: WalletService,
    private service: TransactionService, 
    private router: Router,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  form!: FormGroup;
  categories: Category[] = [];
  wallets: SelectWallet[] = [];

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
        this.categories = categories;
    });

    this.walletService.getWalletsToSelect(this.jwtService.getUserId()).subscribe(wallets => {
      this.wallets = wallets;
    });

    this.form = this.fb.group({
      moneyAmount: [0, [Validators.required, this.notZeroValidator()]],
      comment: [''],
      createdAt: [''],
      walletId: ['', Validators.required],
      categoryId: ['', Validators.required]
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
      const moneyTransaction: CreateTransaction = {
        amount: this.moneyAmount.value,
        comment: this.comment.value,
        createdAt: createdAt !== null ? createdAt.toISOString() : null,
        categoryId: this.categoryId.value,
        walletId: this.walletId.value
      };

      this.service.createTransaction(moneyTransaction, Number(this.jwtService.getUserId())).subscribe(
        response => {
          this.router.navigate(['/transactions']);
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
