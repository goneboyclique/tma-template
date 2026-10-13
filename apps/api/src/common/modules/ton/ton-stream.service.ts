import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import WebSocket from 'ws';
import { env } from '@tooling/env/tma';
import { TonStreamMessage } from 'src/common/types/ton.type';
import { TonService } from './ton.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TonStreamService implements OnModuleInit, OnModuleDestroy {
  private ws?: WebSocket;
  private pingTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;
  private reconnectAttempts = 0;
  private destroyed = false;

  /**
   * True only between a confirmed `subscribed` ack and the socket closing.
   * While this is false no payment can be verified, so it is the signal to
   * watch when payments appear to be stuck in `PENDING`.
   */
  private subscribed = false;

  private readonly logger = new Logger(TonStreamService.name);

  private readonly url = env.TONCENTER_WS_URL;

  private static readonly RECONNECT_BASE_MS = 2_000;
  private static readonly RECONNECT_MAX_MS = 60_000;

  constructor(
    private readonly tonService: TonService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.connect();
  }

  onModuleDestroy() {
    this.destroyed = true;
    clearInterval(this.pingTimer);
    clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }

  /** Whether the service currently has a live TON Center subscription. */
  isSubscribed(): boolean {
    return this.subscribed;
  }

  private connect() {
    this.ws = new WebSocket(this.url, {
      headers: {
        'X-API-Key': env.TONCENTER_API_KEY,
      },
    });

    this.ws.on('open', () => {
      this.logger.log('TON Center connected');

      // `subscribe()` calls TON Center get-methods and can fail. Without
      // this catch a failure is an unhandled rejection and the socket stays
      // open with no subscription, silently verifying nothing.
      this.subscribe()
        .then(() => this.startPing())
        .catch((error) => {
          this.logger.error(
            'TON subscription failed; dropping the socket to retry',
            error,
          );
          this.ws?.close();
        });
    });

    this.ws.on('message', (data) => {
      this.handleMessage(TonStreamService.decodeFrame(data));
    });

    this.ws.on('close', () => {
      this.logger.warn('TON Center disconnected');
      this.subscribed = false;
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
    if (this.reconnectTimer || this.destroyed) {
      return;
    }

    // Exponential backoff: a flat 2 s retry hammers TON Center through an
    // outage and can get the API key rate limited.
    const delay = Math.min(
      TonStreamService.RECONNECT_BASE_MS * 2 ** this.reconnectAttempts,
      TonStreamService.RECONNECT_MAX_MS,
    );
    this.reconnectAttempts += 1;

    this.logger.log(`Reconnecting to TON Center in ${delay} ms`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connect();
    }, delay);
  }

  /** `ws` hands us a Buffer, an array of Buffers, or an ArrayBuffer. */
  private static decodeFrame(data: WebSocket.RawData): string {
    if (Array.isArray(data)) return Buffer.concat(data).toString('utf8');
    if (Buffer.isBuffer(data)) return data.toString('utf8');
    return Buffer.from(data).toString('utf8');
  }

  private handleMessage(raw: string) {
    try {
      const message = JSON.parse(raw) as TonStreamMessage;

      if (message.status === 'subscribed') {
        this.subscribed = true;
        this.reconnectAttempts = 0;
        this.logger.log('TON subscription active');
      }

      if (message.type === 'transactions') {
        this.eventEmitter.emit('transaction', message);
      }
    } catch (error) {
      this.logger.error('Invalid TON WS message', error);
    }
  }
}
