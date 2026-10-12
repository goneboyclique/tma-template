import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpResponse } from '../schemas/http.response.schema';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  HttpResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    if (context.getType() === 'ws') {
      return next.handle();
    }
    return next.handle().pipe(
      map((data: T): HttpResponse<T> => ({
        success: true,
        data,
      })),
    );
  }
}
