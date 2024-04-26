import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { CreateGoalComponent } from './create-goal/create-goal.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CreateTransactionComponent } from './transactions/create-transaction/create-transaction.component';
import { FinancialGoalComponent } from './financial-goal/financial-goal.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full'},
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'goal/:id', component: FinancialGoalComponent, canActivate: [AuthGuard] },
  { path: 'creategoal', component: CreateGoalComponent, canActivate: [AuthGuard] },
  { path: 'wallet/:id', component: WalletComponent, canActivate: [AuthGuard] },
  { path: 'createwallet', component: CreateWalletComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'transaction/:id', component: TransactionComponent, canActivate: [AuthGuard] },
  { path: 'transactions/create', component: CreateTransactionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
