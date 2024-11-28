import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Intercepted request: ');
    console.table(req, ["method", "url", "body", "headers", "params", "responseType"]);

    return next.handle(req);
  }
}
