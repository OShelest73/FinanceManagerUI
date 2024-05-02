import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { JwtService } from '../services/jwt.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})

export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private jwtService: JwtService
  ){}

  notificationCount: number = 0;
  private notificationSubscription!: Subscription;

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.getNotificationCount(this.jwtService.getUserId())
    .subscribe(
      (count: number) => {
        this.notificationCount = count;
      },
      error => {
        console.error('Ошибка при получении оповещений:', error);
      }
    );
  }

  onLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
}