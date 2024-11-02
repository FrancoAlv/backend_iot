// src/firebase/firebase.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { TokenMessage } from "firebase-admin/lib/messaging/messaging-api";

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App) {}

  async sendNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    if (!token) {
      console.error('Error: El token está vacío o no es válido.');
      return ;
    }
    console.log(data || {});
    const message:TokenMessage = {
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
      token: token,
      android: {
        priority: "high",
      },
    };

    try {
      const response = await this.firebaseApp.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
