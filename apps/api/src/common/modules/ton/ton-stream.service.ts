import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import WebSocket from 'ws';
import { env } from '@tooling/env/tma';
import EventEmitter from 'node:events';
import { TonStreamMessage } from 'src/common/types/ton.type';
import { TonService } from './ton.service';

@Injectable()
export class TonStreamService implements OnModuleInit, OnModuleDestroy {
  private ws?: WebSocket;
  private pingTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;

  private readonly logger = new Logger(TonStreamService.name);

  private readonly url = env.TONCENTER_WS_URL;
  private readonly events = new EventEmitter();

  constructor(private readonly tonService: TonService) {}

  onTransaction(callback: (message: TonStreamMessage) => void) {
    this.events.on('transaction', callback);

    return () => {
      this.events.off('transaction', callback);
    };
  }

  private emitTransaction(message: TonStreamMessage) {
    this.events.emit('transaction', message);
  }

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    clearInterval(this.pingTimer);
    clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }

  private connect() {
    this.ws = new WebSocket(this.url, {
      headers: {
        'X-API-Key': env.TONCENTER_API_KEY!,
      },
    });

    this.ws.on('open', () => {
      this.logger.log('TON Center connected');
      this.subscribe();
      this.startPing();
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data.toString());
    });

    this.ws.on('close', () => {
      this.logger.log('TON Center disconnected');
      this.stopPing();
      this.scheduleReconnect();
    });

    this.ws.on('error', (error) => {
      this.logger.error('TON Center WS error', error);
      this.ws?.close();
    });
  }

  private async subscribe() {
    const addresses = await this.tonService.getSupportedWallets();

    this.send({
      operation: 'subscribe',
      types: ['transactions'],
      addresses,
      min_finality: 'finalized',
      id: 'payments',
    });
  }

  private send(message: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private startPing() {
    this.stopPing();

    this.pingTimer = setInterval(() => {
      this.send({
        operation: 'ping',
        id: `ping-${Date.now()}`,
      });
    }, 15_000);
  }

  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = undefined;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connect();
    }, 2_000);
  }

  private async handleMessage(raw: string) {
    try {
      const message = JSON.parse(raw) as TonStreamMessage;

      if (message.status === 'subscribed') {
        this.logger.log('TON subscription active');
      }

      if (message.type === 'transactions') {
        this.emitTransaction(message);
      }
    } catch (error) {
      this.logger.error('Invalid TON WS message', error);
    }
  }
}
