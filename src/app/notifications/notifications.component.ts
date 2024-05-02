import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { NotificationPreview } from '../interfaces/Notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styles: [
  ]
})
export class NotificationsComponent {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private jwtService: JwtService
  ){}

  notifications: NotificationPreview[] = [];
  private notificationSubscription!: Subscription;
  
  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.getNotifications(this.jwtService.getUserId())
    .subscribe(
      (notifications: NotificationPreview[]) => {
        this.notifications = notifications;
      },
      error => {
        console.error('Ошибка при получении оповещений:', error);
      }
    );
  }

  ngOnDestroy(){
    if(this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
}
