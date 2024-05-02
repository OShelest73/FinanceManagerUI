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
import { UpdateTransactionComponent } from './transactions/update-transaction/update-transaction.component';
import { UpdateGoalComponent } from './update-goal/update-goal.component';
import { UpdateWalletComponent } from './update-wallet/update-wallet.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationDetailedComponent } from './notification-detailed/notification-detailed.component';

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
  { path: 'goals/update/:id', component: UpdateGoalComponent, canActivate: [AuthGuard] },
  { path: 'wallet/:id', component: WalletComponent, canActivate: [AuthGuard] },
  { path: 'wallet/update/:id', component: UpdateWalletComponent, canActivate: [AuthGuard] },
  { path: 'createwallet', component: CreateWalletComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'transaction/:id', component: TransactionComponent, canActivate: [AuthGuard] },
  { path: 'transaction/update/:id', component: UpdateTransactionComponent, canActivate: [AuthGuard] },
  { path: 'transactions/create', component: CreateTransactionComponent, canActivate: [AuthGuard] },
  { path: 'transactions/report', component: PieChartComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'notification/:id', component: NotificationDetailedComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
