import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

interface NotificationState {
  token_menssajin: string;
  uid_codigo: string;
  state: string;
  accidente_id: number;
}

@Injectable()
export class NotificationStateObserver {
  private notificationStateSubject = new Subject<NotificationState>();
  public notificationState$ = this.notificationStateSubject.asObservable();

  notify(token_menssajin:string,uid_codigo: string,accidente_id:number, state: string): void {
    this.notificationStateSubject.next({ token_menssajin,uid_codigo,accidente_id, state });
  }
}
