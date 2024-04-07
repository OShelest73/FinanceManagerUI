import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialGoal, FinancialGoalPreview } from '../interfaces/FinancialGoal';
import { FinancialGoalService } from '../services/financial-goal.service';
import { JwtService } from '../services/jwt.service';
import { Subscription } from 'rxjs';
import { WalletService } from '../services/wallet.service';
import { Wallet } from '../interfaces/Wallet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private goalService: FinancialGoalService,
    private walletService: WalletService,
    private jwtService: JwtService
  ){}

  goals: FinancialGoalPreview[] = [];
  wallets: Wallet[] = [];
  private goalSubscription!: Subscription;
  private walletSubscription!: Subscription;

  ngOnInit(): void {
    this.goalSubscription = this.goalService.getGoals(Number(this.jwtService.getUserId()))
    .subscribe(
      (goals: FinancialGoalPreview[]) => {
        this.goals = goals;
      },
      error => {
        console.error('Ошибка при получении финансовых целей:', error);
      }
    );
    
    this.walletSubscription = this.walletService.getWallets(Number(this.jwtService.getUserId()))
    .subscribe(
      (wallets: Wallet[]) => {
        this.wallets = wallets;
      },
      error => {
        console.error('Ошибка при получении счетов:', error);
      }
    );
  }

  ngOnDestroy(){
    if(this.goalSubscription) {
      this.goalSubscription.unsubscribe();
    }
    if(this.walletSubscription) {
      this.walletSubscription.unsubscribe();
    }
  }

}
