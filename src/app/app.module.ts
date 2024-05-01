import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { ToastrModule } from 'ngx-toastr';
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';
import { UserService } from './services/user.service';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { CreateGoalComponent } from './create-goal/create-goal.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CreateTransactionComponent } from './transactions/create-transaction/create-transaction.component';
import { DatePipe } from '@angular/common';
import { FinancialGoalComponent } from './financial-goal/financial-goal.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { WalletComponent } from './wallet/wallet.component';
import { UpdateTransactionComponent } from './transactions/update-transaction/update-transaction.component';
import { UpdateGoalComponent } from './update-goal/update-goal.component';
import { UpdateWalletComponent } from './update-wallet/update-wallet.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    UserComponent,
    HomeComponent,
    HeaderComponent,
    CreateWalletComponent,
    CreateGoalComponent,
    TransactionsComponent,
    CreateTransactionComponent,
    FinancialGoalComponent,
    TransactionComponent,
    WalletComponent,
    UpdateTransactionComponent,
    UpdateGoalComponent,
    UpdateWalletComponent,
    PieChartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: 'increasing',
      enableHtml: true,
      tapToDismiss: true
    }),
    MatProgressBarModule,
    FormsModule,
    ChartModule,
    NgChartsModule
  ],
  providers: [
    DatePipe,
    UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
