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

@WebSocketGateway({ cors: { origin: '*' }, })
@Injectable()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  private pendingResponses: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly whatsappService: WhatsAppService,
              private readonly notificationStateObserver: NotificationStateObserver,
              private readonly accidenteUseCase:AccidenteUseCase) {

    this.notificationStateObserver.notificationState$.subscribe(({ usuarioId,accidente_id, state }) => {
      if (state === 'accidente_detectado') {
        this.server.emit(`notificacionAccidente_${usuarioId}`, {
          mensaje: 'Se ha detectado un accidente, por favor confirme si desea enviar notificaciones automáticas.',
          time_out: 2 * 60 * 1000,
          accidente_id: accidente_id
        });
        const timeout = setTimeout(async () => {
          await accidenteUseCase.notificarFamiliares(usuarioId, accidente_id);
          this.server.emit(`notificacionAccidenteTimeout_${usuarioId}`, {
            mensaje: 'No se recibió respuesta del usuario. Enviando notificaciones automáticas.',
            respuesta:false
          });
          this.pendingResponses.delete(usuarioId.toString());
        }, 2 * 60 * 1000);
        this.pendingResponses.set(usuarioId.toString(), timeout);
      }
    });
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
  async handleUsuarioResponse(@MessageBody() data: { usuarioId: number;accidente_id:number; respuesta: string }): Promise<void> {
    // Cancelar el temporizador si el usuario responde
    const timeout = this.pendingResponses.get(data.usuarioId.toString());
    if (!timeout){
      return;
    }
    clearTimeout(timeout);
    this.pendingResponses.delete(data.usuarioId.toString());
    this.logger.log(`Respuesta recibida del usuario ${data.usuarioId}: ${data.respuesta}`);
    if (data.respuesta.toLowerCase() === 'enviar') {
      await this.accidenteUseCase.notificarFamiliares(data.usuarioId, data.accidente_id);
    }
  }
}
