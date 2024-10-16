import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

interface NotificationState {
  usuarioId: number;
  state: string;
  accidente_id: number;
}

@Injectable()
export class NotificationStateObserver {
  private notificationStateSubject = new Subject<NotificationState>();
  public notificationState$ = this.notificationStateSubject.asObservable();

  notify(usuarioId: number,accidente_id:number, state: string): void {
    this.notificationStateSubject.next({ usuarioId,accidente_id, state });
  }
}
