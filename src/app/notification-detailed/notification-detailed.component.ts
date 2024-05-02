import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../interfaces/Notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-detailed',
  templateUrl: './notification-detailed.component.html',
  styles: [
  ]
})
export class NotificationDetailedComponent {
  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router
  ){}

  notificationId!: string;
  notification!: Notification;
  private notificationSubscription!: Subscription;

  ngOnInit() {
    this.notificationId = this.route.snapshot.params['id'];

    this.notificationSubscription = this.notificationService.getNotificationDetailed(this.notificationId)
    .subscribe(
      (notification: Notification) => {
        this.notification = notification;
      },
      error => {
        console.error('Ошибка при получении оповещения:', error);
      }
    );
  }

  onDelete() {
    this.notificationService.deleteNotification(this.notificationId).subscribe(
      () => {
        this.router.navigate(['/notifications']);
      },
      error => {
        console.error('Ошибка при удалении оповещения:', error);
      }
    );
  }
}
