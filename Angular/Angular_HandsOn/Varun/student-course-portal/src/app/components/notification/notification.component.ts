import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  providers: [NotificationService],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  // Component-level providers create a separate NotificationService instance for this component subtree.
  private readonly notificationService = inject(NotificationService);
  readonly messages = this.notificationService.getMessages();
}
