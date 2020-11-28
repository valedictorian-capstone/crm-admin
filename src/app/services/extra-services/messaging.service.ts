import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NotificationVM } from '@view-models';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  currentMessage = new Subject<NotificationVM>();
  constructor(
    protected readonly angularFireMessaging: AngularFireMessaging
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (messaging) => {
        messaging.onMessage = messaging.onMessage.bind(messaging);
        // tslint:disable-next-line: deprecation
        messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
      }
    );
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: NotificationVM) => {
        this.currentMessage.next(payload);
      });
  }
}
