import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PaymentType } from '@pkg/db/schemas';
import { Server, Socket } from 'socket.io';
import { CORS_ORIGINS } from 'src/common/constants/env.constants';

type EventType = 'payment.updated';
type PayloadType = PaymentType;

@WebSocketGateway({
  namespace: 'ton-payment',
  cors: {
    origin: CORS_ORIGINS,
  },
})
export class PaymentGateway {
  private readonly logger = new Logger(PaymentGateway.name);

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('payment.subscribe')
  subscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { paymentId: string },
  ) {
    void socket.join(data.paymentId);
  }

  @SubscribeMessage('payment.unsubscribe')
  unsubscribe(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { paymentId: string },
  ) {
    void socket.leave(data.paymentId);
  }

  emitUpdate(clientId: string, eventType: EventType, payload: PayloadType) {
    this.server.to(clientId).emit(eventType, payload);
  }
}
