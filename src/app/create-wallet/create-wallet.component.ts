import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationError } from 'src/app/interfaces/validationError';
import { LoginResponse } from 'src/app/interfaces/LoginResponce';
import { WalletService } from '../services/wallet.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styles: [
  ]
})

export class CreateWalletComponent implements OnInit{
  constructor
  (
    private service: WalletService, 
    private router: Router,
    private jwtService: JwtService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    
  }

  form = new FormGroup({
    walletName: new FormControl<string>('', Validators.required),
    moneyAmount: new FormControl<number>(0)
  });

  get walletName(){
    return this.form.controls.walletName as FormControl;
  }
  get moneyAmount(){
    return this.form.controls.moneyAmount as FormControl;
  }

  submitWallet(){
    this.service.createWallet(this.walletName.value, this.moneyAmount.value, Number(this.jwtService.getUserId())).subscribe(
      response => {
         console.log('Кошелек успешно создан:', response);
         this.router.navigateByUrl("home");
      },
      error => {
         console.error('Ошибка при создании кошелька:', error);
         this.toastr.error(error.errorMessage, 'Ошибка при создании');
      }
     );
  }

}