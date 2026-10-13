/**
 * Envelope applied to every HTTP response by `ResponseInterceptor` and
 * `HttpExceptionFilter`. WebSocket payloads are not wrapped.
 */
export type HttpResponse<T> =
  { success: true; data: T } | { success: false; error: string };
