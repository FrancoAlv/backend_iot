import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppService } from "../../services/WhatsAppService";
import { NotificationStateObserver } from "../observers/NotificationStateObserver";
import { AccidenteUseCase } from "../useCases/AccidenteUseCase";
import { FirebaseService } from "../../firebase/firebase.service";

@WebSocketGateway({ cors: { origin: '*' }, })
@Injectable()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  private pendingResponses: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly whatsappService: WhatsAppService,
              private readonly notificationStateObserver: NotificationStateObserver,
              private readonly accidenteUseCase:AccidenteUseCase,
              private readonly firebaseService: FirebaseService,) {
    this.handleNotification();
  }

  async handleNotification() {
    this.notificationStateObserver.notificationState$.subscribe(
      async ({ uid_codigo, token_menssajin, accidente_id, state }) => {
        if (state === 'accidente_detectado') {
          // Enviar notificación de accidente
          await this.firebaseService.sendNotification(
            token_menssajin, // Token del dispositivo FCM del usuario
            'Se ha detectado un accidente',
            'Por favor confirme si desea enviar notificaciones automáticas.',
            {
              accidente_id: accidente_id.toString(),
              mensaje:'Se ha detectado un accidente.\n Por favor confirme si desea enviar notificaciones automáticas.',
              timeout: (2 * 60 * 1000).toString(), // En milisegundos como string
            },
          );

          const timeout = setTimeout(async () => {
            await this.accidenteUseCase.notificarFamiliares(uid_codigo, accidente_id);
            await this.firebaseService.sendNotification(
              token_menssajin, // Token FCM del usuario
              'Notificación de Accidente Automática',
              'No se recibió respuesta. Enviando notificaciones automáticas.',
              { respuesta: 'false' },
            );

            this.pendingResponses.delete(uid_codigo.toString());
          }, 2 * 60 * 1000); // Espera de 2 minutos para enviar la segunda notificación
          this.logger.log("accidente_detectado");
          this.logger.log(timeout);
          this.logger.log(uid_codigo.toString());
          this.pendingResponses.set(uid_codigo.toString(), timeout);
        }
      },
    );
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('accidenteRegistrado')
  async handleAccidenteRegistrado(@MessageBody() data: { usuarioId: string; mensaje: string }): Promise<void> {
    // Emitir notificación al usuario
    this.server.emit(`notificacionAccidente_${data.usuarioId}`, {
      mensaje: data.mensaje,
    });

    // Configurar el temporizador para enviar notificación automática después de 2 minutos
    const timeout = setTimeout(async () => {
      // Si no hay respuesta en 2 minutos, enviar notificaciones automáticas
      this.server.emit(`notificacionAccidenteTimeout_${data.usuarioId}`, {
        mensaje: 'No se recibió respuesta del usuario. Enviando notificaciones automáticas.',
      });
      await this.whatsappService.sendWhatsAppMessage(
        '+1234567890', // Número de teléfono de la autoridad (ejemplo)
        'Se ha registrado un accidente y no se ha recibido respuesta del usuario. Por favor, tomar las medidas necesarias.'
      );
    }, 2 * 60 * 1000);

    // Guardar el temporizador para poder cancelarlo si el usuario responde
    this.pendingResponses.set(data.usuarioId, timeout);
  }

  @SubscribeMessage('respuestaUsuario')
  async handleUsuarioResponse(@MessageBody() data: { uid_codigo: string;accidente_id:number; respuesta: string }): Promise<void> {

    // Cancelar el temporizador si el usuario responde
    const timeout = this.pendingResponses.get(data.uid_codigo.toString());
    this.logger.log(`Respuesta recibida del usuario ${data.uid_codigo}: ${data.respuesta} ${timeout}`);
    if (!timeout){
      return;
    }
    clearTimeout(timeout);
    this.pendingResponses.delete(data.uid_codigo.toString());
    this.logger.log(`Respuesta recibida del usuario ${data.uid_codigo} : ${data.respuesta}  ${data.respuesta.toLowerCase() === 'enviar'}`);
    if (data.respuesta.toLowerCase() === 'enviar') {
      await this.accidenteUseCase.notificarFamiliares(data.uid_codigo, data.accidente_id);
    }

  }
}
