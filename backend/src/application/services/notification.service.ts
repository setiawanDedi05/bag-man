import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    console.log({ message });

    try {
      const response = await this.firebaseAdmin.messaging().send(message);
      console.log({ response });
      console.log('Push Notification sent Successfully');
    } catch (error) {
      throw error;
    }
  }
}
