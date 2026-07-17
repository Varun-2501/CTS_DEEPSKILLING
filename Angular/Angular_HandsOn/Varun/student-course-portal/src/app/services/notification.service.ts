import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
  private readonly messages: string[] = ['Welcome to the portal'];

  add(message: string): void {
    this.messages.push(message);
  }

  getMessages(): string[] {
    return [...this.messages];
  }
}
