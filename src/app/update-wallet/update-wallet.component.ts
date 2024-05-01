import { Component } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Wallet } from '../interfaces/Wallet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-wallet',
  templateUrl: './update-wallet.component.html',
  styles: [
  ]
})
export class UpdateWalletComponent {
  constructor
  (
    private walletService: WalletService, 
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ){}

  walletId!: string;
  wallet!: Wallet;
  private walletSubscription!: Subscription;
  form!: FormGroup;

  ngOnInit(): void {
    this.walletId = this.route.snapshot.params['id'];

    this.walletSubscription = this.walletService.getWalletDetailed(this.walletId)
    .subscribe(
      (wallet: Wallet) => {
        this.wallet = wallet;

        this.form = new FormGroup({
          walletName: new FormControl<string>(wallet.walletName, Validators.required),
          moneyAmount: new FormControl<number>(wallet.moneyAmount)
        });
        
        this.form.patchValue({
          moneyAmount: this.wallet.moneyAmount,
          walletName: this.wallet.walletName
        });
      },
      error => {
        console.error('Ошибка при получении транзакции:', error);
      }
    );
  }

  get walletName(){
    return this.form.controls['walletName'] as FormControl;
  }
  get moneyAmount(){
    return this.form.controls['moneyAmount'] as FormControl;
  }

  submitWallet(){
    const wallet: Wallet = {
      id: Number(this.walletId),
      walletName: this.walletName.value,
      moneyAmount: this.moneyAmount.value,
    };

    this.walletService.updateWallet(wallet, this.jwtService.getUserId()).subscribe(
      response => {
         console.log('Кошелек успешно обновлён:', response);
         this.router.navigate((['/wallet/' + this.walletId]));
      },
      error => {
         console.error('Ошибка при обновлении кошелька:', error);
         this.toastr.error(error.errorMessage, 'Ошибка при создании');
      }
     );
  }
}
