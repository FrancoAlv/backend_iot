import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

interface NotificationState {
  uid_codigo: string;
  usuarioId: number;
  state: string;
  accidente_id: number;
}

@Injectable()
export class NotificationStateObserver {
  private notificationStateSubject = new Subject<NotificationState>();
  public notificationState$ = this.notificationStateSubject.asObservable();

  notify(uid_codigo:string,usuarioId: number,accidente_id:number, state: string): void {
    this.notificationStateSubject.next({ uid_codigo,usuarioId,accidente_id, state });
  }
}
